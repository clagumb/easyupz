package models

type Gesamtansicht struct {
	ID       uint    `json:"lehrer_id"`
	Vorname  string  `json:"vorname"`
	Nachname string  `json:"nachname"`
	SOLL     float32 `json:"soll_wochenstunden"`
	IST      float32 `json:"ist_wochenstunden"`
}
