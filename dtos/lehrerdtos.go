package dtos

import "easyupz/dateutil"

type LehrerRequest struct {
	Vorname           string            `json:"vorname"`
	Nachname          string            `json:"nachname"`
	Geburtsdatum      dateutil.DateOnly `json:"geburtsdatum"`
	Dienstverhaeltnis string            `json:"dienstverhaeltnis"`
	QE                string            `json:"qualifikationsebene"`
	Stammschule       string            `json:"schulnummer"`
	Kuerzel           string            `json:"kuerzel"`

	Schuljahr struct {
		SchuljahrID uint `json:"schuljahr_id"`
	} `json:"schuljahr"`
}

type LehrerMitKuerzel struct {
	LehrerID            uint   `json:"lehrer_id"`
	Vorname             string `json:"vorname"`
	Nachname            string `json:"nachname"`
	Geburtsdatum        string `json:"geburtsdatum"`
	Dienstverhaeltnis   string `json:"dienstverhaeltnis"`
	Qualifikationsebene string `json:"qualifikationsebene"`
	Stammschule         string `json:"schulnummer"`
	Kuerzel             string `json:"kuerzel"`
}

type Lehrereinsatz struct {
	LehrerID    uint   `gorm:"column:lehrer_id" json:"lehrer_id"`
	SchuljahrID uint   `gorm:"column:schuljahr_id" json:"schuljahr_id"`
	Kuerzel     string `gorm:"column:kuerzel" json:"kuerzel"`
	Schulnummer string `gorm:"column:schulnummer" json:"schulnummer"`
}

func (Lehrereinsatz) TableName() string {
	return "lehrereinsatz"
}
