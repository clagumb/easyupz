package handlers

import (
	"easyupz/models"
	"easyupz/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func GetBenutzer(c *gin.Context) {
	var benutzer []models.Benutzer
	services.DB.Find(&benutzer)
	c.JSON(http.StatusOK, benutzer)
}

type registerDTO struct {
	Benutzer string `json:"benutzer"`
	Passwort string `json:"passwort"`
	Rolle    string `json:"rolle"`
	Kuerzel  string `json:"kuerzel"`
}

func PostBenutzer(c *gin.Context) {
	var neuerBenutzer registerDTO
	if err := c.BindJSON(&neuerBenutzer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	benutzerResponse,err := services.RegisterBenutzer(neuerBenutzer.Benutzer, neuerBenutzer.Passwort, neuerBenutzer.Rolle, neuerBenutzer.Kuerzel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, benutzerResponse)
}

func DeleteBenutzer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige ID"})
		return
	}

	var zuLoeschen models.Benutzer
	result := services.DB.First(&zuLoeschen, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Benutzer nicht gefunden"})
		return
	}

	if zuLoeschen.Rolle == "admin" {
		var anzahlAdmins int64
		services.DB.Model(&models.Benutzer{}).Where("rolle = ?", "admin").Count(&anzahlAdmins)

		if anzahlAdmins <= 1 {
			c.JSON(http.StatusConflict, gin.H{"error": "Es muss mindestens ein Administrator vorhanden bleiben"})
			return
		}
	}

	deleteResult := services.DB.Delete(&zuLoeschen)
	if deleteResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": deleteResult.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
