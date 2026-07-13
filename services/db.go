package services

import (
	"easyupz/models"
	"fmt"
	"log"
	"os"
	"path/filepath"

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

	dbPath := loader.GetValue("database", "path")
	if dbPath != "" {
		dir := filepath.Dir(dbPath)
		if err := os.MkdirAll(dir, 0755); err != nil {
			panic("Fehler beim Erstellen des Datenbank-Verzeichnisses: " + err.Error())
		}
	}

	dsn := dbPath + "?_foreign_keys=on"

	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic("Fehler beim Öffnen der Datenbank: " + err.Error())
	}

	if err := DB.AutoMigrate(
		&models.Lehrer{},
		&models.Benutzer{},
		&models.Schuljahr{},
		&models.Wochenfaktor{},
		&models.Lehrereinsatz{},
		&models.Stundenmass{},
		&models.Anrechnung{},
		&models.Ermaessigung{},
		&models.Upz{},
		&models.LehrerAnrechnung{},
		&models.LehrerErmaessigung{},
	); err != nil {
		log.Fatalf("AutoMigrate fehlgeschlagen: %v", err)
	}

	fmt.Println("Datenbankverbindung steht!")

	seedStandardBenutzer()
	SeedGrunddaten()
}

// seedStandardBenutzer legt beim ersten Start einen Admin-Benutzer an,
// falls noch kein Benutzer in der Datenbank vorhanden ist.
func seedStandardBenutzer() {
	var anzahl int64
	DB.Model(&models.Benutzer{}).Count(&anzahl)
	if anzahl > 0 {
		return
	}

	_, err := RegisterBenutzer("admin", "!!UPZ!!", "admin", "ADM")
	if err != nil {
		log.Printf("Warnung: Standard-Admin konnte nicht angelegt werden: %v", err)
		return
	}
	fmt.Println("Standard-Admin angelegt: Benutzer=admin, Passwort=!!UPZ!!, Rolle=admin")
	fmt.Println("WICHTIG: Bitte das Passwort nach dem ersten Login ändern!")
}
