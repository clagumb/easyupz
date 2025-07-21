package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"easyupz/models"
	"easyupz/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ----------------------------------------------------
// GET /ermaessigung
// ----------------------------------------------------
func GetErmaessigung(c *gin.Context) {
	var ermaessigungen []models.Ermaessigung
	if err := services.DB.Find(&ermaessigungen).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Laden"})
		return
	}
	c.JSON(http.StatusOK, ermaessigungen)
}

// ----------------------------------------------------
// POST /ermaessigung
// ----------------------------------------------------
func PostErmaessigung(c *gin.Context) {
	var neu models.Ermaessigung
	if err := c.ShouldBindJSON(&neu); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültiges JSON: " + err.Error()})
		return
	}

	if err := services.DB.Create(&neu).Error; err != nil {
		// UNIQUE‑Constraint?
		if strings.Contains(err.Error(), "UNIQUE") || strings.Contains(err.Error(), "duplicate") {
			c.JSON(http.StatusConflict, gin.H{"error": "Dieses Kürzel existiert bereits."})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Fehler beim Speichern"})
		return
	}

	c.JSON(http.StatusCreated, neu)
}

// ----------------------------------------------------
// PATCH /ermaessigung/:id   (nur Anzeigeform ändern)
// ----------------------------------------------------
func PatchErmaessigung(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige ID"})
		return
	}

	var payload struct {
		Anzeigeform string `json:"anzeigeform"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil || strings.TrimSpace(payload.Anzeigeform) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Anzeigeform darf nicht leer sein"})
		return
	}

	var e models.Ermaessigung
	if err := services.DB.First(&e, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ermäßigung nicht gefunden"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	e.Anzeigeform = payload.Anzeigeform
	if err := services.DB.Save(&e).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Speichern fehlgeschlagen"})
		return
	}

	c.JSON(http.StatusOK, e)
}

// ----------------------------------------------------
// DELETE /ermaessigung/:id
// ----------------------------------------------------
func DeleteErmaessigung(c *gin.Context) {
	castInt, err := strconv.Atoi(c.Param("id"))
	if err != nil || castInt < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ungültige ID"})
		return
	}
	id := uint(castInt)

	// 1) Prüfen, ob die Ermäßigung irgendwo verwendet wird
	var count int64
	// ❗ Falls deine Bezugstabelle anders heißt, ersetze models.LehrerErmaessigung durch das richtige Modell
	if err := services.DB.
		Model(&models.LehrerErmaessigung{}).
		Where("ermaessigung_id = ?", id).
		Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Verwendungsprüfung fehlgeschlagen"})
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{
			"error": fmt.Sprintf("Diese Ermäßigung ist in %d Datensätzen verwendet und kann nicht gelöscht werden.", count),
		})
		return
	}

	// 2) Datensatz laden
	var zuLoeschen models.Ermaessigung
	if err := services.DB.First(&zuLoeschen, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ermäßigung nicht gefunden"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 3) Löschen
	if err := services.DB.Delete(&zuLoeschen).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
