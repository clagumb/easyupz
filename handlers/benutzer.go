package handlers

import (
	"easyupz/models"
	"easyupz/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetBenutzer(c *gin.Context) {
	var lehrer []models.BenutzerResponse
	services.DB.Find(&lehrer)
	c.JSON(http.StatusOK, lehrer)
}

func PostBenutzer(c *gin.Context) {
	var neuer models.Benutzer
	if err := c.BindJSON(&neuer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	services.DB.Create(&neuer)
	c.JSON(http.StatusCreated, neuer)
}

func DeleteBenutzer(c *gin.Context) {
	id := c.Param("id")
	services.DB.Delete(&models.Benutzer{}, id)
}
