package models

type Gesamtansicht struct {
	ID       uint   `json:"lehrer_id"`
	Vorname  string `json:"lehrer_vorname"`
	Nachname string `json:"lehrer_nachname"`
}
