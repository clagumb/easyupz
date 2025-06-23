package handlers

import (
	"easyupz/dtos"
	"easyupz/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func GetEinzelansicht(c *gin.Context) {
	castInt, err := strconv.Atoi(c.Param("id"))
	if err != nil || castInt < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige Lehrer-ID"})
		return
	}
	lehrerId := uint(castInt)

	castInt, err = strconv.Atoi(c.Query("schuljahr_id"))
	if err != nil || castInt < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige Schuljahr-ID"})
		return
	}
	schuljahrId := uint(castInt)

	var schuljahrText string
	if schuljahrId == 1 {
		schuljahrText = "2024/25"
	} else {
		schuljahrText = "2025/26"
	}

	var data dtos.Einzelansicht
	err = services.DB.
		Table("lehrer").
		Select("lehrer.id, lehrer.vorname, lehrer.nachname").
		Where("lehrer.id = ?", lehrerId).
		Scan(&data).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lehrer nicht gefunden"})
		return
	}

	data.Schuljahr = schuljahrText
	c.JSON(http.StatusOK, data)
}
