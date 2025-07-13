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
		upz.ist_unterrichtsstunden / (wochenfaktoren.schultage / 5.0) AS ist
	`).
		Joins(`
		JOIN upz 
		ON upz.lehrer_id = lehrer.id 
		AND upz.schuljahr_id = ?`, schuljahrID).
		Joins(`
		JOIN wochenfaktoren 
		ON wochenfaktoren.schuljahr_id = upz.schuljahr_id 
		AND wochenfaktoren.bezeichnung = 'Schuljahr'
	`).
		Order("lehrer.nachname, lehrer.vorname").
		Scan(&daten).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Abrufen der Daten"})
		return
	}

	c.JSON(200, daten)
}
