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
	router := gin.Default()

	staticContent, err := fs.Sub(staticFiles, "static")
	if err != nil {
		panic(err)
	}
	router.StaticFS("/static", http.FS(staticContent))

	/*
		router.GET("/", func(c *gin.Context) {
			c.Redirect(http.StatusFound, "/home")
		})
	*/

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

	fmt.Println("Server läuft auf http://localhost:8080")
	router.Run(":8080")
}
