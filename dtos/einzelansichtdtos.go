package dtos

type Einzelansicht struct {
	LehrerID  uint   `gorm:"column:id" json:"lehrer_id"`
	Vorname   string `json:"vorname"`
	Nachname  string `json:"nachname"`
	Schuljahr string `json:"schuljahr"`
}
