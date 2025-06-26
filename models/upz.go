package models

type Upz struct {
	ID          uint    `gorm:"primaryKey" json:"upz_id"`
	LehrerID    uint    `gorm:"not null" json:"lehrer_id"`
	SchuljahrID uint    `gorm:"not null" json:"schuljahr_id"`
	UntStd      float32 `gorm:"not null" json:"untStd"`
}

func (Upz) TableName() string {
	return "upz"
}
