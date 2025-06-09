package handlers

import (
	"easyupz/services"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Login(c *gin.Context) {
	var credentials struct {
		Benutzer string `json:"benutzer"`
		Passwort string `json:"passwort"`
	}

	if err := c.BindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Ungültige Anfrage"})
		return
	}

	user, err := services.Login(credentials.Benutzer, credentials.Passwort)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Login fehlgeschlagen"})
		return
	}

	session := sessions.Default(c)
	session.Set("benutzer", user.Benutzer)
	session.Set("rolle", user.Rolle)
	err = session.Save()
	if err != nil {
		fmt.Println("Fehler beim Speichern der Session: ", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":   "success",
		"message":  "Login erfolgreich",
		"benutzer": user.Benutzer,
		"rolle":    user.Rolle,
	})
}

func Status(c *gin.Context) {
	session := sessions.Default(c)
	benutzer := session.Get("benutzer")
	rolle := session.Get("rolle")

	if benutzer == nil || rolle == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Nicht eingeloggt"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"benutzer": benutzer,
		"rolle":    rolle,
	})
}

func Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	if err := session.Save(); err != nil {
		fmt.Println("Fehler beim Löschen der Session: ", err)
	}
	c.Status(http.StatusOK) // ❗ keine JSON-Antwort mehr, einfach leer zurückgeben
}
