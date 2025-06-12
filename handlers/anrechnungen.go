package handlers

import (
	"easyupz/models"
	"easyupz/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAnrechnug(c *gin.Context) {
	var anrechnungen []models.AnrechnungResponse
	services.DB.Find(&anrechnungen)
	c.JSON(http.StatusOK, anrechnungen)
}

func PostAnrechnung(c *gin.Context) {
	var neuer models.Anrechnung
	if err := c.BindJSON(&neuer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(&neuer.Kurzform)
	services.DB.Create(&neuer)
	c.JSON(http.StatusCreated, neuer)
}
