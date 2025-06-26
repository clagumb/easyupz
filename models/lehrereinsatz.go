package models

type Lehrereinsatz struct {
	ID          uint   `gorm:"primaryKey;autoIncrement" json:"lehrereinsatz_id"`
	LehrerID    uint   `gorm:"not null;column:lehrer_id" json:"lehrer_id"`
	SchuljahrID uint   `gorm:"not null;column:schuljahr_id;uniqueIndex:uniq_kuerzel_jahr_schule" json:"schuljahr_id"`
	Kuerzel     string `gorm:"not null;column:kuerzel;uniqueIndex:uniq_kuerzel_jahr_schule" json:"kuerzel"`
	Schulnummer string `gorm:"not null;column:schulnummer;uniqueIndex:uniq_kuerzel_jahr_schule" json:"schulnummer"`
}

func (Lehrereinsatz) TableName() string {
	return "lehrereinsatz"
}
