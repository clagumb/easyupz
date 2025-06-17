package models

type Lehrer struct {
	ID                uint   `gorm:"primaryKey" json:"id"`
	Vorname           string `json:"vorname"`
	Nachname          string `gorm:"not null" json:"nachname"`
	Geburtsdatum      string `json:"geburtsdatum"`
	Dienstverhaeltnis string `gorm:"not null" json:"dienstverhaeltnis"`
	QE                uint8  `gorm:"not null" json:"qualifikationsebene"`
	Stammschule       string `gorm:"not null" json:"stammschule"`
}

func (Lehrer) TableName() string {
	return "lehrer"
}
