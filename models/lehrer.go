package models

type Lehrer struct {
	Id       uint `gorm:"primaryKey"`
	Vorname  string
	Nachname string
}

type LehrerResponse struct {
	Id       uint   `json:"id"`
	Vorname  string `json:"vorname"`
	Nachname string `json:"nachname"`
}

func (Lehrer) TableName() string {
	return "lehrer"
}
