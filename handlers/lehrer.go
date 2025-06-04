package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"upzbayern/models"
	"upzbayern/services"
)

func GetLehrer(c *gin.Context) {
	var lehrer []models.Lehrer
	services.DB.Find(&lehrer)
	c.JSON(http.StatusOK, lehrer)
}

func PostLehrer(c *gin.Context) {
	var neuer models.Lehrer
	if err := c.BindJSON(&neuer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	services.DB.Create(&neuer)
	c.JSON(http.StatusCreated, neuer)
}
