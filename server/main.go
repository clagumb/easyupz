package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type lehrerstamm struct {
	Id       uint   `json:"id"`
	Vorname  string `json:"vorname"`
	Nachname string `json:"nachname"`
}

var lehrkraefte = []lehrerstamm{
	{Id: 1, Vorname: "Anna", Nachname: "Müller"},
	{Id: 2, Vorname: "Peter", Nachname: "Schmidt"},
}

func main() {
	router := gin.Default()
	router.GET("/lehrer", findAll)
	err := router.Run("localhost:8080")
	if err != nil {
		fmt.Println("Fehler: ", err)
		return
	}
}

func findAll(content *gin.Context) {
	content.IndentedJSON(http.StatusOK, lehrkraefte)
}
