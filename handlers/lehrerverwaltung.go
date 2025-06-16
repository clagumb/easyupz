package handlers

import (
	"easyupz/models"
	"easyupz/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetLehrerverwaltung(c *gin.Context) {
	var lehrer []models.Lehrer
	services.DB.
		Order("lehrer.nachname, lehrer.vorname").
		Find(&lehrer)
	c.JSON(http.StatusOK, lehrer)
}

func PostLehrerverwaltung(c *gin.Context) {
	var neuer models.Lehrer
	if err := c.BindJSON(&neuer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	services.DB.Create(&neuer)
	c.JSON(http.StatusCreated, neuer)
}
