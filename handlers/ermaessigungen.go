package handlers

import (
	"easyupz/models"
	"easyupz/services"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func GetErmaessigung(c *gin.Context) {
	var ermaessigungen []models.Ermaessigung
	services.DB.Find(&ermaessigungen)
	c.JSON(http.StatusOK, ermaessigungen)
}

func PostErmaessigung(c *gin.Context) {
	var neuer models.Anrechnung
	if err := c.BindJSON(&neuer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(&neuer.Kurzform)
	services.DB.Create(&neuer)
	c.JSON(http.StatusCreated, neuer)
}

func DeleteEmaessigung(c *gin.Context) {
	castInt, err := strconv.Atoi(c.Param("id"))
	if err != nil || castInt < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige Anrechnung-ID"})
		return
	}
	id := uint(castInt)

	var zuLoeschen models.Anrechnung
	result := services.DB.First(&zuLoeschen, id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Anrechnung nicht gefunden"})
		return
	} else if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	deleteResult := services.DB.Delete(&zuLoeschen)
	if deleteResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": deleteResult.Error.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
