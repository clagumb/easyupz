package main

import (
	"fmt"
	"net/http"
	"upzbayern/models"
	"upzbayern/services"

	"github.com/gin-gonic/gin"
)

func main() {
	services.Init()
	router := gin.Default()

	router.StaticFS("/home", http.Dir("./static"))

	router.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusFound, "/home")
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
