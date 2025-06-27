package dtos

type WochenfaktorDTO struct {
	ID          uint   `json:"wochenfaktor_id"`
	Bezeichnung string `json:"bezeichnung"`
	Beginn      string `json:"beginn"`
	Ende        string `json:"ende"`
	Schultage   uint   `json:"schultage"`
}

type SchuljahrDTO struct {
	ID              uint              `json:"schuljahr_id"`
	Anzeigeform     string            `json:"anzeigeform"`
	Aktiv           bool              `json:"aktiv"`
	SchultageGesamt uint              `json:"schultage"`
	Wochenfaktoren  []WochenfaktorDTO `json:"wochenfaktoren"`
}
