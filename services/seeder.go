package services

import (
	"easyupz/dateutil"
	"easyupz/models"
	"fmt"
	"log"
	"time"
)

// SeedGrunddaten legt beim ersten Start alle notwendigen Grunddaten an,
// falls die Datenbank noch leer ist (kein Schuljahr vorhanden).
func SeedGrunddaten() {
	var anzahlSchuljahre int64
	DB.Model(&models.Schuljahr{}).Count(&anzahlSchuljahre)
	if anzahlSchuljahre > 0 {
		return
	}

	fmt.Println("Datenbank ist leer – lege Grunddaten an...")

	seedSchuljahr()
	seedAnrechnungen()
	seedErmaessigungen()

	fmt.Println("Grunddaten erfolgreich angelegt.")
}

// seedSchuljahr legt das aktuelle Schuljahr 2025/26 mit typischen
// bayerischen Wochenfaktoren (Halbjahrseinteilung) an.
func seedSchuljahr() {
	// Schuljahr 2025/26: 01.09.2025 – 31.07.2026
	// Typische bayerische Halbjahrseinteilung:
	//   1. Halbjahr: 11.09.2025 – 06.02.2026 (ca. 88 Schultage)
	//   2. Halbjahr: 09.02.2026 – 31.07.2026 (ca. 92 Schultage)
	//   Schuljahr gesamt: 180 Schultage

	schuljahr := models.Schuljahr{
		Anzeigeform: "2026/27",
		Aktiv:       true,
		Wochenfaktoren: []models.Wochenfaktor{
			{
				Bezeichnung: "Schuljahr",
				Beginn:      datumAus(2026, 9, 15),
				Ende:        datumAus(2026, 7, 30),
				Schultage:   180,
			},
			{
				Bezeichnung: "1. Halbjahr",
				Beginn:      datumAus(2026, 9, 15),
				Ende:        datumAus(2027, 2, 6),
				Schultage:   88,
			},
			{
				Bezeichnung: "2. Halbjahr",
				Beginn:      datumAus(2026, 2, 9),
				Ende:        datumAus(2026, 7, 31),
				Schultage:   92,
			},
		},
	}

	if err := DB.Create(&schuljahr).Error; err != nil {
		log.Printf("Warnung: Schuljahr konnte nicht angelegt werden: %v", err)
		return
	}
	fmt.Printf("Schuljahr '%s' angelegt (ID=%d, aktiv=%v)\n",
		schuljahr.Anzeigeform, schuljahr.ID, schuljahr.Aktiv)
}

// seedAnrechnungen legt typische Anrechnungsstunden-Arten für bayerische
// berufsbildende Schulen an.
func seedAnrechnungen() {
	anrechnungen := []models.Anrechnung{
		{Kurzform: "SB", Anzeigeform: "Schulleitung / Beratung"},
		{Kurzform: "FBL", Anzeigeform: "Fachbereichsleitung"},
		{Kurzform: "SV", Anzeigeform: "Schülervertretungsbetreuung"},
		{Kurzform: "FR", Anzeigeform: "Fachschaftsarbeit / Fachreferat"},
		{Kurzform: "PR", Anzeigeform: "Personalratsarbeit"},
		{Kurzform: "AuB", Anzeigeform: "Ausbildungsbeauftragte/r"},
		{Kurzform: "SI", Anzeigeform: "Sicherheitsbeauftragte/r"},
		{Kurzform: "EDV", Anzeigeform: "EDV-Beauftragte/r"},
		{Kurzform: "SONE", Anzeigeform: "Sonstiges"},
	}

	for _, a := range anrechnungen {
		if err := DB.Create(&a).Error; err != nil {
			log.Printf("Warnung: Anrechnung '%s' konnte nicht angelegt werden: %v", a.Kurzform, err)
		}
	}
	fmt.Printf("%d Anrechnungsarten angelegt\n", len(anrechnungen))
}

// seedErmaessigungen legt typische Ermäßigungsarten für bayerische
// berufsbildende Schulen an.
func seedErmaessigungen() {
	ermaessigungen := []models.Ermaessigung{
		{Kurzform: "AB55", Anzeigeform: "Altersermäßigung ab 55 Jahren"},
		{Kurzform: "AB60", Anzeigeform: "Altersermäßigung ab 60 Jahren"},
		{Kurzform: "TZ", Anzeigeform: "Teilzeit"},
		{Kurzform: "SB", Anzeigeform: "Schwerbehindert"},
		{Kurzform: "MU", Anzeigeform: "Mutterschutz / Elternzeit"},
		{Kurzform: "ABO", Anzeigeform: "Abordnung an andere Schule"},
		{Kurzform: "SONE", Anzeigeform: "Sonstige Ermäßigung"},
	}

	for _, e := range ermaessigungen {
		if err := DB.Create(&e).Error; err != nil {
			log.Printf("Warnung: Ermäßigung '%s' konnte nicht angelegt werden: %v", e.Kurzform, err)
		}
	}
	fmt.Printf("%d Ermäßigungsarten angelegt\n", len(ermaessigungen))
}

// datumAus erstellt ein dateutil.DateOnly aus Jahr, Monat und Tag.
func datumAus(jahr int, monat time.Month, tag int) dateutil.DateOnly {
	return dateutil.DateOnly{Time: time.Date(jahr, monat, tag, 0, 0, 0, 0, time.UTC)}
}
