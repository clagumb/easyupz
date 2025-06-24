package handlers

import (
	"easyupz/dtos"
	"easyupz/models"
	"easyupz/services"
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

	err := services.DB.Transaction(func(tx *gorm.DB) error {
		lehrer := models.Lehrer{
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

		lehrereinsatz := dtos.Lehrereinsatz{
			LehrerID:    lehrer.ID,
			SchuljahrID: req.Schuljahr.SchuljahrID,
			Kuerzel:     req.Kuerzel,
			Schulnummer: req.Stammschule,
		}

		if err := tx.Create(&lehrereinsatz).Error; err != nil {
			return err
		}

		c.JSON(http.StatusCreated, gin.H{
			"lehrer":        lehrer,
			"lehrereinsatz": lehrereinsatz,
		})
		return nil
	})

	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Kürzel bereits vergeben!"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Speichern"})
		}
	}
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

	if req.Alt.Kuerzel != req.Neu.Kuerzel {
		result := services.DB.
			Where("lehrer_id = ? AND schuljahr_id = ? AND schulnummer = ? AND kuerzel = ?",
				lehrerId,
				req.Neu.Schuljahr.SchuljahrID,
				req.Alt.Schulnummer,
				req.Alt.Kuerzel).
			Delete(&dtos.Lehrereinsatz{})

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Löschen des bestehenden Lehrereinsatzes"})
			return
		}

		neuerEinsatz := dtos.Lehrereinsatz{
			LehrerID:    lehrerId,
			SchuljahrID: req.Neu.Schuljahr.SchuljahrID,
			Schulnummer: req.Neu.Schulnummer,
			Kuerzel:     req.Neu.Kuerzel,
		}

		if err := services.DB.Create(&neuerEinsatz).Error; err != nil {
			if strings.Contains(err.Error(), "UNIQUE constraint failed") {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Kürzel bereits vergeben!"})
				return
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Neuer Lehrereinsatz konnte nicht gespeichert werden"})
				return
			}
		}

		if req.Alt.Schulnummer != req.Neu.Schulnummer {
			var einsaetze []dtos.Lehrereinsatz

			if err := services.DB.
				Where("lehrer_id = ?", lehrerId).Find(&einsaetze).Error; err != nil {
				services.DB.
					Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Lehrereinsätze konnten nicht geladen werden"})
				return
			}

			for _, einsatz := range einsaetze {
				var count int64
				services.DB.Model(&dtos.Lehrereinsatz{}).
					Where("lehrer_id = ? AND schuljahr_id = ? AND kuerzel = ? AND schulnummer = ?",
						einsatz.LehrerID, einsatz.SchuljahrID, einsatz.Kuerzel, req.Neu.Schulnummer).
					Count(&count)

				if count > 0 {
					if err := services.DB.
						Where("lehrer_id = ? AND schuljahr_id = ? AND kuerzel = ? AND schulnummer = ?",
							einsatz.LehrerID, einsatz.SchuljahrID, einsatz.Kuerzel, einsatz.Schulnummer).
						Delete(&dtos.Lehrereinsatz{}).Error; err != nil {
						services.DB.
							Rollback()
						c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Löschen alter Einsätze"})
						return
					}
					continue
				}

				if err := services.DB.
					Where("lehrer_id = ? AND schuljahr_id = ? AND kuerzel = ? AND schulnummer = ?",
						einsatz.LehrerID, einsatz.SchuljahrID, einsatz.Kuerzel, einsatz.Schulnummer).
					Delete(&dtos.Lehrereinsatz{}).Error; err != nil {
					services.DB.
						Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Löschen alter Einsätze"})
					return
				}

				einsatz.Schulnummer = req.Neu.Schulnummer
				if err := services.DB.
					Create(&einsatz).Error; err != nil {
					services.DB.
						Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Anlegen neuer Einsätze"})
					return
				}
			}
		}
		c.JSON(http.StatusOK, gin.H{"message": "Lehrer erfolgreich aktualisiert"})
	}
}
