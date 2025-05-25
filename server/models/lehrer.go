package models

type Lehrer struct {
	Id       uint `gorm:"primaryKey"`
	Vorname  string
	Nachname string
}

func (Lehrer) TableName() string {
	return "lehrer"
}
