package services

import (
	"fmt"
	"upzbayern/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {

	var err error
	cfgloader, err := NewConfigLoader()
	if err != nil {
		panic("Fehler beim Öffnen der Config-Datei: " + err.Error())
	}

	DB, err = gorm.Open(sqlite.Open(cfgloader.GetValue("database", "path")), &gorm.Config{})
	if err != nil {
		panic("Fehler beim Öffnen der Datenbank: " + err.Error())
	}

	DB.AutoMigrate(&models.Lehrer{}, &models.Benutzer{})
	fmt.Println("Datenbankverbindng steht!")
}
