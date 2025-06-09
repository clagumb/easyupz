package services

import (
	"easyupz/models"
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func RegisterBenutzer(username, plainPassword, rolle string) error {
	var existing models.Benutzer
	err := DB.Where("benutzer = ?", username).First(&existing).Error
	if err == nil {
		return fmt.Errorf("benutzername '%s' ist bereits vergeben", username)
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return fmt.Errorf("fehler beim prüfen des benutzers: %v", err)
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("fehler beim hashen des passworts: %v", err)
	}

	benutzer := models.Benutzer{
		Benutzer: username,
		Passwort: string(hash),
		Rolle:    rolle,
	}

	if err := DB.Create(&benutzer).Error; err != nil {
		return fmt.Errorf("fehler beim speichern in der datenbank: %v", err)
	}

	return nil
}

func Login(username, plainPassword string) (*models.Benutzer, error) {
	var benutzer models.Benutzer
	err := DB.Where("benutzer = ?", username).First(&benutzer).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("benutzer '%s' wurde nicht gefunden", username)
		}
		return nil, fmt.Errorf("fehler beim zugriff auf die datenbank: %v", err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(benutzer.Passwort), []byte(plainPassword))
	if err != nil {
		return nil, fmt.Errorf("falsches Passwort")
	}

	return &benutzer, nil
}
