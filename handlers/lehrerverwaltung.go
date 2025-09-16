package handlers

import (
	"easyupz/dtos"
	"easyupz/models"
	"easyupz/services"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"strings"
)

func GetLehrerverwaltung(c *gin.Context) {
	id, err := strconv.Atoi(c.Query("schuljahr_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ungültige schuljahr_id"})
		return
	}

	var lehrer []dtos.LehrerMitKuerzel

	services.DB = services.DB.Debug()
	err = services.DB.
		Table("lehrer").
		Select(`lehrer.id AS lehrer_id, vorname, nachname, geburtsdatum, 
		        dienstverhaeltnis, qe AS qualifikationsebene, stammschule,
		        lehrereinsatz.kuerzel`).
		Joins(`LEFT JOIN lehrereinsatz 
		       ON lehrereinsatz.lehrer_id = lehrer.id 
		       AND lehrereinsatz.schuljahr_id = ? 
		       AND lehrereinsatz.schulnummer = lehrer.stammschule`, id).
		Order("lehrer.nachname, lehrer.vorname").
		Scan(&lehrer).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Abrufen der Daten"})
		return
	}

	c.JSON(http.StatusOK, lehrer)
}

func PostLehrerverwaltung(c *gin.Context) {
	var req dtos.LehrerRequest

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var lehrer models.Lehrer
	var lehrereinsatz models.Lehrereinsatz

	err := services.DB.Transaction(func(tx *gorm.DB) error {
		lehrer = models.Lehrer{
			Vorname:           req.Vorname,
			Nachname:          req.Nachname,
			Geburtsdatum:      req.Geburtsdatum,
			Dienstverhaeltnis: req.Dienstverhaeltnis,
			QE:                req.QE,
			Stammschule:       req.Stammschule,
		}

		if err := tx.Create(&lehrer).Error; err != nil {
			return err
		}

		lehrereinsatz = models.Lehrereinsatz{
			LehrerID:    lehrer.ID,
			SchuljahrID: req.Schuljahr.SchuljahrID,
			Kuerzel:     req.Kuerzel,
			Schulnummer: req.Stammschule,
		}

		if err := tx.Create(&lehrereinsatz).Error; err != nil {
			return err
		}

		reduzierung := models.Reduzierung{
			LehrerID:    lehrer.ID,
			SchuljahrID: req.Schuljahr.SchuljahrID,
		}

		if err := tx.Create(&reduzierung).Error; err != nil {
			return err
		}

		var wf models.Wochenfaktor
		if err := tx.Where("schuljahr_id = ? AND bezeichnung = ?", req.Schuljahr.SchuljahrID, "Schuljahr").
			First(&wf).Error; err != nil {
			return fmt.Errorf("Wochenfaktor 'Schuljahr' nicht gefunden: %w", err)
		}

		stundenmass := models.Stundenmass{
			LehrerID:       lehrer.ID,
			WochenfaktorID: wf.ID,
		}

		switch lehrer.QE {
		case "QE3":
			stundenmass.Wochenstunden = 27.0
		case "QE4":
			stundenmass.Wochenstunden = 24.0
		default:
			stundenmass.Wochenstunden = 0.0
		}

		if err := tx.Create(&stundenmass).Error; err != nil {
			return err
		}

		upz := models.Upz{
			LehrerID:              lehrer.ID,
			SchuljahrID:           req.Schuljahr.SchuljahrID,
			StundenmassID:         stundenmass.ID,
			ReduzierungID:         reduzierung.ID,
			UebertragVorjahr:      0.0,
			IstUnterrichtsstunden: 0.0,
		}

		if err := tx.Create(&upz).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Kürzel bereits vergeben!"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Speichern"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"lehrer":        lehrer,
		"lehrereinsatz": lehrereinsatz,
	})
}

func PatchLehrerverwaltung(c *gin.Context) {
	castInt, err := strconv.Atoi(c.Param("id"))
	if err != nil || castInt < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige Lehrer-ID"})
		return
	}
	lehrerId := uint(castInt)

	var req dtos.LehrerUpdateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	update := map[string]interface{}{
		"vorname":           req.Neu.Vorname,
		"nachname":          req.Neu.Nachname,
		"geburtsdatum":      req.Neu.Geburtsdatum,
		"dienstverhaeltnis": req.Neu.Dienstverhaeltnis,
		"qe":                req.Neu.Qualifikationsebene,
		"stammschule":       req.Neu.Schulnummer,
	}

	if err := services.DB.Model(&models.Lehrer{}).
		Where("id = ?", lehrerId).
		Updates(update).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lehrer konnte nicht aktualisiert werden"})
		return
	}

	kuerzelGeaendert := req.Alt.Kuerzel != req.Neu.Kuerzel
	schulnummerGeaendert := req.Alt.Schulnummer != req.Neu.Schulnummer

	if kuerzelGeaendert || schulnummerGeaendert {
		tx := services.DB.Begin()

		var count int64
		tx.Model(&models.Lehrereinsatz{}).
			Where("lehrer_id = ? AND schuljahr_id = ? AND schulnummer = ? AND kuerzel = ?",
				lehrerId,
				req.Neu.Schuljahr.SchuljahrID,
				req.Neu.Schulnummer,
				req.Neu.Kuerzel).
			Count(&count)

		if count > 0 {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Lehrerkürzel bereits vorhanden"})
			return
		}

		if err := tx.
			Where("lehrer_id = ? AND schuljahr_id = ? AND schulnummer = ? AND kuerzel = ?",
				lehrerId,
				req.Neu.Schuljahr.SchuljahrID,
				req.Alt.Schulnummer,
				req.Alt.Kuerzel).
			Delete(&models.Lehrereinsatz{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Löschen des alten Lehrereinsatzes"})
			return
		}

		lehrereinsatz := models.Lehrereinsatz{
			LehrerID:    lehrerId,
			SchuljahrID: req.Neu.Schuljahr.SchuljahrID,
			Schulnummer: req.Neu.Schulnummer,
			Kuerzel:     req.Neu.Kuerzel,
		}

		if err := tx.Create(&lehrereinsatz).Error; err != nil {
			tx.Rollback()
			if strings.Contains(err.Error(), "UNIQUE constraint failed") {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Lehrerkürzel bereits vorhanden"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Neuer Lehrereinsatz konnte nicht gespeichert werden"})
			return
		}

		reduzierung := models.Reduzierung{
			LehrerID:    lehrereinsatz.LehrerID,
			SchuljahrID: lehrereinsatz.SchuljahrID,
		}

		if err := tx.Create(&reduzierung).Error; err != nil {
			tx.Rollback()
			return
		}

		var wf models.Wochenfaktor
		if err := tx.Where("schuljahr_id = ? AND bezeichnung = ?", lehrereinsatz.SchuljahrID, "Schuljahr").
			First(&wf).Error; err != nil {
			tx.Rollback()
			return
		}

		stundenmass := models.Stundenmass{
			LehrerID:       lehrereinsatz.LehrerID,
			WochenfaktorID: wf.ID,
		}

		switch update["qe"].(string) {
		case "QE3":
			stundenmass.Wochenstunden = 27.0
		case "QE4":
			stundenmass.Wochenstunden = 24.0
		default:
			stundenmass.Wochenstunden = 0.0
		}

		if err := tx.Create(&stundenmass).Error; err != nil {
			tx.Rollback()
			return
		}

		upz := models.Upz{
			LehrerID:              lehrereinsatz.LehrerID,
			SchuljahrID:           lehrereinsatz.SchuljahrID,
			StundenmassID:         stundenmass.ID,
			ReduzierungID:         reduzierung.ID,
			UebertragVorjahr:      0.0,
			IstUnterrichtsstunden: stundenmass.Wochenstunden * float64(wf.Schultage/5),
		}

		if err := tx.Create(&upz).Error; err != nil {
			tx.Rollback()
			return
		}

		tx.Commit()
	}

	c.JSON(http.StatusOK, gin.H{"message": "Lehrer erfolgreich aktualisiert"})
}
