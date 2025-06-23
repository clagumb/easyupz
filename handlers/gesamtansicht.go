package handlers

import (
	"easyupz/models"
	"easyupz/services"
	"github.com/gin-gonic/gin"
)

func GetGesamtansicht(c *gin.Context) {
	var daten []models.Gesamtansicht
	services.DB.
		Table("lehrer").
		Select("lehrer.id, lehrer.vorname, lehrer.nachname").
		//Joins("JOIN lehrer ON lehrer.id = anrechnung.lehrer_id").
		Order("lehrer.nachname, lehrer.vorname").
		Scan(&daten)
	c.JSON(200, daten)
}
