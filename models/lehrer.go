package models

type Lehrer struct {
	Id       uint   `gorm:"primaryKey" json:"id"`
	Vorname  string `json:"vorname"`
	Nachname string `json:"nachname"`
}

func (Lehrer) TableName() string {
	return "lehrer"
}
