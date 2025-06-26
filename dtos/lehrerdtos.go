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

type LehrerUpdateRequest struct {
	Alt struct {
		Kuerzel     string `json:"kuerzel"`
		Schulnummer string `json:"schulnummer"`
	} `json:"alt"`
	Neu struct {
		Vorname             string            `json:"vorname"`
		Nachname            string            `json:"nachname"`
		Geburtsdatum        dateutil.DateOnly `json:"geburtsdatum"`
		Dienstverhaeltnis   string            `json:"dienstverhaeltnis"`
		Qualifikationsebene string            `json:"qualifikationsebene"`
		Schulnummer         string            `json:"schulnummer"`
		Kuerzel             string            `json:"kuerzel"`
		Schuljahr           struct {
			SchuljahrID uint `json:"schuljahr_id"`
		} `json:"schuljahr"`
	} `json:"neu"`
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
