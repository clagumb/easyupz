package handlers

import (
	"easyupz/dtos"
	"easyupz/models"
	"easyupz/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetAlleSchuljahre(c *gin.Context) {
	var schuljahre []models.Schuljahr

	services.DB.
		Preload("Wochenfaktoren").
		Find(&schuljahre)

	var dto []dtos.SchuljahrDTO
	for _, sj := range schuljahre {
		dto = append(dto, services.MappingSchuljahrToDTO(sj))
	}

	c.JSON(http.StatusOK, dto)
}

func GetAktivesSchuljahr(c *gin.Context) {
	var schuljahr models.Schuljahr

	result := services.DB.
		Preload("Wochenfaktoren").
		Where("aktiv = ?", true).
		First(&schuljahr)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kein aktives Schuljahr gefunden"})
		return
	}

	dto := services.MappingSchuljahrToDTO(schuljahr)
	c.JSON(http.StatusOK, dto)
}
