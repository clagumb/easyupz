package models

type Anrechnung struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Kurzform    string `gorm:"unique;not null" json:"kurzform"`
	Anzeigeform string `gorm:"not null" json:"anzeigeform"`
	Langform    string `gorm:"not null" json:"langform"`
}

func (Anrechnung) TableName() string {
	return "anrechnungen"
}
