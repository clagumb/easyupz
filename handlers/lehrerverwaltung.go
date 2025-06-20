package handlers

import (
	"easyupz/dtos"
	"easyupz/models"
	"easyupz/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
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

	lehrer := models.Lehrer{
		Vorname:           req.Vorname,
		Nachname:          req.Nachname,
		Geburtsdatum:      req.Geburtsdatum,
		Dienstverhaeltnis: req.Dienstverhaeltnis,
		QE:                req.QE,
		Stammschule:       req.Stammschule,
	}

	if err := services.DB.Create(&lehrer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lehrer konnte nicht gespeichert werden"})
		return
	}

	lehrereinsatz := dtos.Lehrereinsatz{
		LehrerID:    lehrer.ID,
		SchuljahrID: req.Schuljahr.SchuljahrID,
		Kuerzel:     req.Kuerzel,
		Schulnummer: req.Stammschule,
	}

	if err := services.DB.Create(&lehrereinsatz).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lehrereinsatz konnte nicht gespeichert werden"})
		return
	}

	// Erfolg zurückgeben
	c.JSON(http.StatusCreated, gin.H{
		"lehrer":        lehrer,
		"lehrereinsatz": lehrereinsatz,
	})
}
