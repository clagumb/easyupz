package services

import (
	"easyupz/models"
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {

	var err error
	loader, err := NewConfigLoader()
	if err != nil {
		panic("Fehler beim Öffnen der Config-Datei: " + err.Error())
	}

	DB, err = gorm.Open(sqlite.Open(loader.GetValue("database", "path")), &gorm.Config{})
	if err != nil {
		panic("Fehler beim Öffnen der Datenbank: " + err.Error())
	}

	DB.AutoMigrate(&models.Lehrer{}, &models.Benutzer{}, &models.Anrechnung{})
	fmt.Println("Datenbankverbindung steht!")
}
