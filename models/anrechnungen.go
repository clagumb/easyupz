package models

type Anrechnungen struct {
	ID          uint   `gorm:"primaryKey"`
	Kurzform    string `gorm:"unique;not null"`
	Anzeigeform string `gorm:"not null"`
	Langform    string
}

func (Anrechnungen) TableName() string {
	return "anrechnungen"
}
