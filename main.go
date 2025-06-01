package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"upzbayern/models"
	"upzbayern/services"

	"github.com/gin-gonic/gin"
)

//go:embed static/*
var staticFiles embed.FS

//go:embed static/index.html
var indexHtml []byte

func main() {
	services.Init()

	// Test des Logins
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

	user, err = services.Login("seki", "seki123!")
	if err != nil {
		fmt.Println("Login fehlgeschlagen:", err)
	} else {
		fmt.Println("Login erfolgreich! Benutzer:", user.Benutzer, "Rolle:", user.Rolle)
	}

	router := gin.Default()

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

	loader, err := services.NewConfigLoader()
	if err != nil {
		panic("konfiguration konnte nicht geladen werden: " + err.Error())
	}

	ip := loader.GetValue("server", "ip")
	port := loader.GetValue("server", "port")
	address := fmt.Sprintf("%s:%s", ip, port)

	fmt.Println("Server läuft auf http://" + address)
	router.Run(address)
}
