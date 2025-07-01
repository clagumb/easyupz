package models

type Upz struct {
	ID       uint   `gorm:"primaryKey" json:"upz_id"`
	LehrerID uint   `gorm:"not null;index:idx_upz_lehrer_schuljahr,unique" json:"lehrer_id"`
	Lehrer   Lehrer `gorm:"foreignKey:LehrerID"`

	SchuljahrID uint      `gorm:"not null;index:idx_upz_lehrer_schuljahr,unique" json:"schuljahr_id"`
	Schuljahr   Schuljahr `gorm:"foreignKey:SchuljahrID"`

	StundenmassID uint        `gorm:"not null" json:"stundenmass_id"`
	Stundenmass   Stundenmass `gorm:"foreignKey:StundenmassID"`

	ReduzierungID uint        `gorm:"not null" json:"reduzierung_id"`
	Reduzierung   Reduzierung `gorm:"foreignKey:ReduzierungID"`

	UebertragVorjahr      float64 `gorm:"not null;default:0" json:"uebertrag_vorjahr"`
	IstUnterrichtsstunden float64 `gorm:"not null;default:0" json:"ist_unterrichtsstunden"`
}

func (Upz) TableName() string {
	return "upz"
}
