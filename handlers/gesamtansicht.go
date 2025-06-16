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

/*
func PostLehrer(c *gin.Context) {
	var neuer models.Lehrer
	if err := c.BindJSON(&neuer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	services.DB.Create(&neuer)
	c.JSON(http.StatusCreated, neuer)
}
*/
