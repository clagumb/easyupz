package models

type Ermaessigung struct {
	ID          uint   `gorm:"primaryKey" json:"ermaessigung_id"`
	Kurzform    string `gorm:"unique;not null" json:"kurzform"`
	Anzeigeform string `gorm:"not null" json:"anzeigeform"`
}

func (Ermaessigung) TableName() string {
	return "ermaessigungen"
}

type LehrerErmaessigung struct {
	ID             uint         `gorm:"primaryKey"`
	ReduzierungID  uint         `gorm:"not null"`
	ErmaessigungID uint         `gorm:"not null"`
	Ermaessigung   Ermaessigung `gorm:"foreignKey:ErmaessigungID"`
	WochenfaktorID uint         `gorm:"not null"`
	Wochenfaktor   Wochenfaktor `gorm:"foreignKey:WochenfaktorID"`
	Wochenstunden  float64      `gorm:"not null"`
}

func (LehrerErmaessigung) TableName() string {
	return "lehrer_ermaessigungen"
}
