package handlers

import (
	"easyupz/dtos"
	"easyupz/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetEinzelansicht(c *gin.Context) {
	castInt, err := strconv.Atoi(c.Param("id"))
	if err != nil || castInt < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige Lehrer-ID"})
		return
	}
	lehrerId := uint(castInt)

	castInt, err = strconv.Atoi(c.Query("schuljahr_id"))
	if err != nil || castInt < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige Schuljahr-ID"})
		return
	}
	schuljahrId := uint(castInt)

	// Basisdaten der Lehrkraft und Arbeitszeitkomponenten per JOIN ermitteln
	type rohDaten struct {
		ID               uint
		Vorname          string
		Nachname         string
		Kuerzel          string
		Wochenstunden    float64
		Anrechnungen     float64
		Ermaessigungen   float64
		UebertragVorjahr float64
		Soll             float64
		Ist              float64
	}

	var roh rohDaten
	err = services.DB.
		Table("lehrer").
		Select(`
			lehrer.id,
			lehrer.vorname,
			lehrer.nachname,
			lehrereinsatz.kuerzel,
			stundenmass.wochenstunden,
			IFNULL(upz.uebertrag_vorjahr, 0) AS uebertrag_vorjahr,
			IFNULL(anrechnung.summe, 0)      AS anrechnungen,
			IFNULL(ermaessigung.summe, 0)    AS ermaessigungen,
			(
				stundenmass.wochenstunden
				- IFNULL(upz.uebertrag_vorjahr, 0)
				- IFNULL(anrechnung.summe, 0)
				- IFNULL(ermaessigung.summe, 0)
			) AS soll,
			CAST((upz.ist_unterrichtsstunden * 1000 / (wochenfaktoren.schultage / 5.0)) AS INTEGER) / 1000.0 AS ist
		`).
		Joins(`
			LEFT JOIN lehrereinsatz
				ON lehrereinsatz.lehrer_id = lehrer.id
				AND lehrereinsatz.schuljahr_id = ?`, schuljahrId).
		Joins(`
			LEFT JOIN upz
				ON upz.lehrer_id = lehrer.id
				AND upz.schuljahr_id = ?`, schuljahrId).
		Joins(`
			LEFT JOIN wochenfaktoren
				ON wochenfaktoren.schuljahr_id = upz.schuljahr_id
				AND wochenfaktoren.bezeichnung = 'Schuljahr'`).
		Joins(`
			LEFT JOIN stundenmass
				ON stundenmass.lehrer_id = lehrer.id
				AND stundenmass.wochenfaktor_id = wochenfaktoren.id`).
		Joins(`
			LEFT JOIN (
				SELECT la.upz_id, SUM(la.wochenstunden) AS summe
				FROM lehrer_anrechnungen la
				JOIN wochenfaktoren wf ON wf.id = la.wochenfaktor_id AND wf.bezeichnung = 'Schuljahr'
				GROUP BY la.upz_id
			) AS anrechnung ON anrechnung.upz_id = upz.id`).
		Joins(`
			LEFT JOIN (
				SELECT le.upz_id, SUM(le.wochenstunden) AS summe
				FROM lehrer_ermaessigungen le
				JOIN wochenfaktoren wf ON wf.id = le.wochenfaktor_id AND wf.bezeichnung = 'Schuljahr'
				GROUP BY le.upz_id
			) AS ermaessigung ON ermaessigung.upz_id = upz.id`).
		Where("lehrer.id = ?", lehrerId).
		Scan(&roh).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lehrer nicht gefunden"})
		return
	}

	data := dtos.Einzelansicht{
		ID:       roh.ID,
		Vorname:  roh.Vorname,
		Nachname: roh.Nachname,
		Kuerzel:  roh.Kuerzel,
		Arbeitszeit: dtos.ArbeitszeitKomponenten{
			Wochenstunden:    roh.Wochenstunden,
			Anrechnungen:     roh.Anrechnungen,
			Ermaessigungen:   roh.Ermaessigungen,
			UebertragVorjahr: roh.UebertragVorjahr,
			Soll:             roh.Soll,
			Ist:              roh.Ist,
		},
	}

	c.JSON(http.StatusOK, data)
}
