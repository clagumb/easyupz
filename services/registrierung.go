package services

import (
	"errors"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"upzbayern/models"
)

func RegisterBenutzer(username, plainPassword, rolle string) error {
	var existing models.Benutzer
	err := DB.Where("benutzer = ?", username).First(&existing).Error
	if err == nil {
		return fmt.Errorf("Benutzername '%s' ist bereits vergeben", username)
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return fmt.Errorf("Fehler beim Prüfen des Benutzers: %v", err)
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("Fehler beim Hashen des Passworts: %v", err)
	}

	benutzer := models.Benutzer{
		Benutzer: username,
		Passwort: string(hash),
		Rolle:    rolle,
	}

	if err := DB.Create(&benutzer).Error; err != nil {
		return fmt.Errorf("Fehler beim Speichern in der Datenbank: %v", err)
	}

	return nil
}

func Login(username, plainPassword string) (*models.Benutzer, error) {
	var benutzer models.Benutzer
	err := DB.Where("benutzer = ?", username).First(&benutzer).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("Benutzer '%s' wurde nicht gefunden", username)
		}
		return nil, fmt.Errorf("Fehler beim Zugriff auf die Datenbank: %v", err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(benutzer.Passwort), []byte(plainPassword))
	if err != nil {
		return nil, fmt.Errorf("Falsches Passwort")
	}

	return &benutzer, nil
}
