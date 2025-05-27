package services

import (
	"upzbayern/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
	var err error
	DB, err = gorm.Open(sqlite.Open("../data/upzdata.db"), &gorm.Config{})
	if err != nil {
		panic("Fehler beim Öffnen der Datenbank: " + err.Error())
	}

	DB.AutoMigrate(&models.Lehrer{})
}
