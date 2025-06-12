package models

type Anrechnung struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Kurzform    string `gorm:"unique;not null" json:"kurzform"`
	Anzeigeform string `gorm:"not null" json:"anzeigeform"`
	Langform    string `gorm:"not null" json:"langform"`
}

type AnrechnungResponse struct {
	ID          uint   `json:"id"`
	Kurzform    string `json:"kurzform"`
	Anzeigeform string `json:"anzeigeform"`
	Langform    string `json:"langform"`
}

func (Anrechnung) TableName() string {
	return "anrechnungen"
}
