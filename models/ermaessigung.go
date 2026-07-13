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
	UpzID          uint         `gorm:"not null;index" json:"upz_id"`
	ErmaessigungID uint         `gorm:"not null" json:"ermaessigung_id"`
	Ermaessigung   Ermaessigung `gorm:"foreignKey:ErmaessigungID"`
	WochenfaktorID uint         `gorm:"not null" json:"wochenfaktor_id"`
	Wochenfaktor   Wochenfaktor `gorm:"foreignKey:WochenfaktorID"`
	Wochenstunden  float64      `gorm:"not null" json:"wochenstunden"`
}

func (LehrerErmaessigung) TableName() string {
	return "lehrer_ermaessigungen"
}
