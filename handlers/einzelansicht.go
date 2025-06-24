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

	var data dtos.Einzelansicht
	err = services.DB.
		Table("lehrer").
		Select("lehrer.vorname, lehrer.nachname, lehrereinsatz.kuerzel").
		Joins("LEFT JOIN lehrereinsatz ON lehrereinsatz.lehrer_id = lehrer.id AND lehrereinsatz.schuljahr_id = ?", schuljahrId).
		Where("lehrer.id = ?", lehrerId).
		Scan(&data).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lehrer nicht gefunden"})
		return
	}

	c.JSON(http.StatusOK, data)
}
