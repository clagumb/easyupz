package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"upzbayern/models"
	"upzbayern/services"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"

	"github.com/gin-gonic/gin"
)

//go:embed static/*
var staticFiles embed.FS

//go:embed static/index.html
var indexHtml []byte

func main() {
	services.Init()

	/*
		err := services.RegisterBenutzer("seki", "seki123!", "verwaltung")
		if err != nil {
			fmt.Println("Fehler bei Registrierung:", err)
		}

		user, err := services.Login("admin", "!!UPZ!!")
		if err != nil {
			fmt.Println("Login fehlgeschlagen:", err)
		} else {
			fmt.Println("Login erfolgreich! Benutzer:", user.Benutzer, "Rolle:", user.Rolle)
		}
	*/
	router := gin.Default()
	store := cookie.NewStore([]byte("upzbayern")) // Das Secret kann beliebig sein
	store.Options(sessions.Options{
		Path:     "/",
		HttpOnly: true,
		Secure:   false,                // ← true nur bei HTTPS
		SameSite: http.SameSiteLaxMode, // ← erlaubt Cookie bei fetch()
	})
	router.Use(sessions.Sessions("session", store))

	staticContent, err := fs.Sub(staticFiles, "static")
	if err != nil {
		panic(err)
	}

	router.StaticFS("/static", http.FS(staticContent))

	router.GET("/", func(c *gin.Context) {
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexHtml)
	})

	router.GET("/lehrer", func(c *gin.Context) {
		var lehrer []models.Lehrer
		services.DB.Find(&lehrer)
		c.JSON(http.StatusOK, lehrer)
	})

	router.POST("/lehrer", func(c *gin.Context) {
		var neuer models.Lehrer
		if err := c.BindJSON(&neuer); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		services.DB.Create(&neuer)
		c.JSON(http.StatusCreated, neuer)
	})

	router.POST("/login", func(c *gin.Context) {
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
	})

	router.GET("/status", func(c *gin.Context) {
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
	})

	router.POST("/logout", func(c *gin.Context) {
		session := sessions.Default(c)
		session.Clear()
		err = session.Save()
		if err != nil {
			fmt.Println("Fehler beim Löschen der Session: ", err)
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Logout erfolgreich"})
	})

	// Config-Loader beginn
	loader, err := services.NewConfigLoader()
	if err != nil {
		panic("konfiguration konnte nicht geladen werden: " + err.Error())
	}

	ip := loader.GetValue("server", "ip")
	port := loader.GetValue("server", "port")
	address := fmt.Sprintf("%s:%s", ip, port)

	fmt.Println("Server läuft auf http://" + address)
	err = router.Run(address)
	if err != nil {
		fmt.Println("Fehler beim Starten des Servers ", err)
		return
	}
}
