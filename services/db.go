package services

import (
	"easyupz/models"
	"fmt"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Init() {

	var err error
	loader, err := NewConfigLoader()
	if err != nil {
		panic("Fehler beim Öffnen der Config-Datei: " + err.Error())
	}

	dsn := loader.GetValue("database", "path") + "?_foreign_keys=on"

	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic("Fehler beim Öffnen der Datenbank: " + err.Error())
	}

	if err := DB.AutoMigrate(&models.Lehrer{},
		&models.Benutzer{},
		&models.Schuljahr{},
		&models.Lehrereinsatz{},
		&models.Anrechnung{},
		&models.LehrerAnrechnung{},
		&models.Ermaessigung{},
		&models.LehrerErmaessigung{},
		&models.Upz{},
		&models.Reduzierung{},
		&models.Wochenfaktor{},
		&models.Stundenmass{}); err != nil {
		log.Fatalf("AutoMigrate fehlgeschlagen: %v", err)
	}

	fmt.Println("Datenbankverbindung steht!")
}
