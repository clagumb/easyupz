package models

type Gesamtansicht struct {
	ID       uint   `json:"lehrer_id"`
	Vorname  string `json:"vorname"`
	Nachname string `json:"nachname"`
}
