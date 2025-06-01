package models

type Benutzer struct {
	ID       uint   `gorm:"primaryKey"`
	Benutzer string `gorm:"unique;not null"`
	Passwort string `gorm:"not null"`
	Rolle    string
}

func (Benutzer) TableName() string {
	return "benutzer"
}
