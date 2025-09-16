package dtos

type Einzelansicht struct {
	ID       uint   `json:"id"`
	Vorname  string `json:"vorname"`
	Nachname string `json:"nachname"`
	Kuerzel  string `json:"kuerzel"`
}
