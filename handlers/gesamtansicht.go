package handlers

import (
	"easyupz/models"
	"easyupz/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func GetGesamtansicht(c *gin.Context) {
	castInt, err := strconv.Atoi(c.Query("schuljahr_id"))
	if err != nil || castInt < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige Schuljahr-ID"})
		return
	}
	schuljahrID := uint(castInt)

	var daten []models.Gesamtansicht
	err = services.DB.
		Table("lehrer").
		Select(`
		lehrer.id,
		lehrer.vorname,
		lehrer.nachname,
		(
			stundenmass.wochenstunden
			- IFNULL(upz.uebertrag_vorjahr, 0)
			- IFNULL(anrechnung.summe, 0)
			- IFNULL(ermaessigung.summe, 0)
		) AS soll,
		CAST((upz.ist_unterrichtsstunden * 1000 / (wochenfaktoren.schultage / 5.0)) AS INTEGER) / 1000.0 AS ist
	`).
		Joins(`
		JOIN upz 
			ON upz.lehrer_id = lehrer.id 
			AND upz.schuljahr_id = ?`, schuljahrID).
		Joins(`
		JOIN wochenfaktoren 
			ON wochenfaktoren.schuljahr_id = upz.schuljahr_id 
			AND wochenfaktoren.bezeichnung = 'Schuljahr'`).
		Joins(`
		JOIN stundenmass 
			ON stundenmass.lehrer_id = lehrer.id 
			AND stundenmass.wochenfaktor_id = wochenfaktoren.id`).
		Joins(`
		LEFT JOIN (
			SELECT reduzierung_id, SUM(wochenstunden) AS summe
			FROM lehrer_anrechnungen
			GROUP BY reduzierung_id
		) AS anrechnung ON anrechnung.reduzierung_id = upz.reduzierung_id`).
		Joins(`
		LEFT JOIN (
			SELECT reduzierung_id, SUM(wochenstunden) AS summe
			FROM lehrer_ermaessigungen
			GROUP BY reduzierung_id
		) AS ermaessigung ON ermaessigung.reduzierung_id = upz.reduzierung_id`).
		Order("lehrer.nachname, lehrer.vorname").
		Scan(&daten).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Abrufen der Daten"})
		return
	}

	c.JSON(200, daten)
}
