package models

type Benutzer struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Benutzer string `gorm:"unique;not null" json:"benutzer"`
	Passwort string `gorm:"not null" json:"-"`
	Rolle    string `gorm:"not null" json:"rolle"`
	Kuerzel  string `gorm:"unique;default:null" json:"kuerzel"`
}

func (Benutzer) TableName() string {
	return "benutzer"
}
