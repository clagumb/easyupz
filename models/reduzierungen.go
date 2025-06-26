package models

type Reduzierung struct {
	ID             uint    `gorm:"primaryKey" json:"reduzierung_id"`
	LehrerID       uint    `gorm:"not null" json:"lehrer_id"`
	SchuljahrID    uint    `gorm:"not null" json:"schuljahr_id"`
	AnrechnungID   uint    `json:"anrechnung_id"`
	ErmaessigungID uint    `json:"ermaessigung_id"`
	Jahrestunden   float32 `gorm:"not null" json:"jahrestunden"`
}

func (Reduzierung) TableName() string {
	return "reduzierungen"
}
