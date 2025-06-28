package models

type Anrechnung struct {
	ID          uint   `gorm:"primaryKey" json:"anrechnung_id"`
	Kurzform    string `gorm:"unique;not null" json:"kurzform"`
	Anzeigeform string `gorm:"not null" json:"anzeigeform"`
}

func (Anrechnung) TableName() string {
	return "anrechnungen"
}

type LehrerAnrechnung struct {
	ID             uint         `gorm:"primaryKey"`
	ReduzierungID  uint         `gorm:"not null"`
	AnrechnungID   uint         `gorm:"not null"`
	Anrechnung     Anrechnung   `gorm:"foreignKey:AnrechnungID"`
	WochenfaktorID uint         `gorm:"not null"`
	Wochenfaktor   Wochenfaktor `gorm:"foreignKey:WochenfaktorID"`
	Wochenstunden  float64      `gorm:"not null"`
}

func (LehrerAnrechnung) TableName() string {
	return "lehrer_anrechnungen"
}
