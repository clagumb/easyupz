package dtos

// ArbeitszeitKomponenten enthält die Bestandteile der Unterrichtspflichtzeit
// einer Lehrkraft für die Einzelansicht.
type ArbeitszeitKomponenten struct {
	Wochenstunden    float64 `json:"wochenstunden"`
	Anrechnungen     float64 `json:"anrechnungen"`
	Ermaessigungen   float64 `json:"ermaessigungen"`
	UebertragVorjahr float64 `json:"uebertrag_vorjahr"`
	Soll             float64 `json:"soll"`
	Ist              float64 `json:"ist"`
}

// Einzelansicht ist das Response-DTO für die Einzelansicht einer Lehrkraft.
type Einzelansicht struct {
	ID          uint                   `json:"id"`
	Vorname     string                 `json:"vorname"`
	Nachname    string                 `json:"nachname"`
	Kuerzel     string                 `json:"kuerzel"`
	Arbeitszeit ArbeitszeitKomponenten `json:"arbeitszeit"`
}
