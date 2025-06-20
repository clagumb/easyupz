package models

import (
	"easyupz/dateutil"
)

type Lehrer struct {
	ID                uint              `gorm:"primaryKey" json:"lehrer_id"`
	Vorname           string            `json:"vorname"`
	Nachname          string            `gorm:"not null" json:"nachname"`
	Geburtsdatum      dateutil.DateOnly `json:"geburtsdatum"`
	Dienstverhaeltnis string            `gorm:"not null" json:"dienstverhaeltnis"`
	QE                string            `gorm:"not null" json:"qualifikationsebene"`
	Stammschule       string            `gorm:"not null" json:"schulnummer"`
}

func (Lehrer) TableName() string {
	return "lehrer"
}
