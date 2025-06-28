package models

type Stundenmass struct {
	ID             uint         `gorm:"primaryKey" json:"stundenmass_id"`
	LehrerID       uint         `gorm:"not null" json:"lehrer_id"`
	WochenfaktorID uint         `gorm:"not null" json:"wochenfaktor_id"`
	Wochenfaktor   Wochenfaktor `gorm:"foreignKey:WochenfaktorID" json:"wochenfaktor,omitempty"`
	Wochenstunden  float64      `gorm:"not null" json:"wochenstunden"`
}

func (Stundenmass) TableName() string {
	return "stundenmass"
}
