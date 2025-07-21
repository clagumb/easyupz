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
	"strings"
)

func GetAnrechnug(c *gin.Context) {
	var anrechnungen []models.Anrechnung
	services.DB.Find(&anrechnungen)
	c.JSON(http.StatusOK, anrechnungen)
}

func PostAnrechnung(c *gin.Context) {
	var neueAnrechnung models.Anrechnung
	if err := c.ShouldBindJSON(&neueAnrechnung); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültiges JSON: " + err.Error()})
		return
	}
	if err := services.DB.Create(&neueAnrechnung).Error; err != nil {
		// UNIQUE-Constraint-Fehler erkennen
		if strings.Contains(err.Error(), "UNIQUE") || strings.Contains(err.Error(), "duplicate") {
			c.JSON(http.StatusConflict, gin.H{"error": "Eine Anrechnung mit diesem Kürzel existiert bereits."})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Speichern: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, neueAnrechnung)
}

func DeleteAnrechnung(c *gin.Context) {
	castInt, err := strconv.Atoi(c.Param("id"))
	if err != nil || castInt < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige Anrechnung-ID"})
		return
	}
	id := uint(castInt)

	var count int64
	err = services.DB.
		Model(&models.LehrerAnrechnung{}).
		Where("anrechnung_id = ?", id).
		Count(&count).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Verwendungsprüfung fehlgeschlagen: " + err.Error()})
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{
			"error": fmt.Sprintf("Diese Anrechnung ist in %d Einträgen der Lehrkraft-Zuordnung verwendet und kann nicht gelöscht werden.", count),
		})
		return
	}

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

func PatchAnrechnung(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var payload struct {
		Anzeigeform string `json:"anzeigeform"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil || strings.TrimSpace(payload.Anzeigeform) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige Eingabe"})
		return
	}

	var a models.Anrechnung
	if err := services.DB.First(&a, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Anrechnung nicht gefunden"})
		return
	}

	a.Anzeigeform = payload.Anzeigeform
	if err := services.DB.Save(&a).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Speichern fehlgeschlagen"})
		return
	}

	c.JSON(http.StatusOK, a)
}
