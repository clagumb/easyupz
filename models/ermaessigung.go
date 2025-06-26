package models

type Ermaessigung struct {
	ID          uint   `gorm:"primaryKey" json:"ermaessigung_id"`
	Kurzform    string `gorm:"unique;not null" json:"kurzform"`
	Anzeigeform string `gorm:"not null" json:"anzeigeform"`
	Langform    string `gorm:"not null" json:"langform"`
}

func (Ermaessigung) TableName() string {
	return "ermaessigungen"
}
