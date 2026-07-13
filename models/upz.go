package models

type Upz struct {
	ID       uint   `gorm:"primaryKey" json:"upz_id"`
	LehrerID uint   `gorm:"not null;index:idx_upz_lehrer_schuljahr,unique" json:"lehrer_id"`
	Lehrer   Lehrer `gorm:"foreignKey:LehrerID"`

	SchuljahrID uint      `gorm:"not null;index:idx_upz_lehrer_schuljahr,unique" json:"schuljahr_id"`
	Schuljahr   Schuljahr `gorm:"foreignKey:SchuljahrID"`

	LehrereinsatzID uint          `gorm:"not null" json:"lehrereinsatz_id"`
	Lehrereinsatz   Lehrereinsatz `gorm:"foreignKey:LehrereinsatzID"`

	StundenmassID uint        `gorm:"not null" json:"stundenmass_id"`
	Stundenmass   Stundenmass `gorm:"foreignKey:StundenmassID"`

	Anrechnungen   []LehrerAnrechnung   `gorm:"foreignKey:UpzID"`
	Ermaessigungen []LehrerErmaessigung `gorm:"foreignKey:UpzID"`

	UebertragVorjahr      float64 `gorm:"not null;default:0" json:"uebertrag_vorjahr"`
	IstUnterrichtsstunden float64 `gorm:"not null;default:0" json:"ist_unterrichtsstunden"`
}

func (Upz) TableName() string {
	return "upz"
}
