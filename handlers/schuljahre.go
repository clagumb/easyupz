package handlers

import (
	"easyupz/models"
	"easyupz/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetAlleSchuljahre(c *gin.Context) {
	var schuljahre []models.Schuljahr
	services.DB.
		Find(&schuljahre)
	c.JSON(http.StatusOK, schuljahre)
}

func GetAktivesSchuljahr(c *gin.Context) {
	var schuljahr models.Schuljahr

	result := services.DB.
		Where("aktiv = ?", true).
		First(&schuljahr)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kein aktives Schuljahr gefunden"})
		return
	}

	c.JSON(http.StatusOK, schuljahr)
}
