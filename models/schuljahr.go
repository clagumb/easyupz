package models

type Schuljahr struct {
	ID              uint           `gorm:"primaryKey" json:"schuljahr_id"`
	Anzeigeform     string         `json:"anzeigeform"`
	Aktiv           bool           `gorm:"default:0;not null" json:"aktiv"`
	Wochenfaktoren  []Wochenfaktor `gorm:"foreignKey:SchuljahrID" json:"wochenfaktoren"`
	SchultageGesamt uint           `gorm:"not null" json:"schultage"`
}

func (Schuljahr) TableName() string {
	return "schuljahre"
}
