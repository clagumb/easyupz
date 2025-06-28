package models

type Reduzierung struct {
	ID             uint                 `gorm:"primaryKey"`
	LehrerID       uint                 `gorm:"not null"`
	Lehrer         Lehrer               `gorm:"foreignKey:LehrerID"`
	Anrechnungen   []LehrerAnrechnung   `gorm:"foreignKey:ReduzierungID"`
	Ermaessigungen []LehrerErmaessigung `gorm:"foreignKey:ReduzierungID"`
}

func (Reduzierung) TableName() string {
	return "reduzierungen"
}
