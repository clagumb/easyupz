package models

type Benutzer struct {
	ID       uint   `gorm:"primaryKey"`
	Benutzer string `gorm:"unique;not null"`
	Passwort string `gorm:"not null"`
	Rolle    string `gorm:"not null"`
}

type BenutzerResponse struct {
	ID       uint   `json:"id"`
	Benutzer string `json:"benutzer"`
	Passwort string `json:"-"`
	Rolle    string `json:"rolle"`
}

func (Benutzer) TableName() string {
	return "benutzer"
}
