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
	UpzID          uint         `gorm:"not null;index" json:"upz_id"`
	AnrechnungID   uint         `gorm:"not null" json:"anrechnung_id"`
	Anrechnung     Anrechnung   `gorm:"foreignKey:AnrechnungID"`
	WochenfaktorID uint         `gorm:"not null" json:"wochenfaktor_id"`
	Wochenfaktor   Wochenfaktor `gorm:"foreignKey:WochenfaktorID"`
	Wochenstunden  float64      `gorm:"not null" json:"wochenstunden"`
}

func (LehrerAnrechnung) TableName() string {
	return "lehrer_anrechnungen"
}
