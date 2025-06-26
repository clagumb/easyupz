package models

import "easyupz/dateutil"

type Wochenfaktor struct {
	ID          uint              `gorm:"primaryKey" json:"wochenfaktor_id"`
	SchuljahrID uint              `gorm:"not null" json:"schuljahr_id"`
	Bezeichnung string            `gorm:"not null" json:"bezeichnung"`
	Beginn      dateutil.DateOnly `gorm:"not null" json:"beginn"`
	Ende        dateutil.DateOnly `gorm:"not null" json:"ende"`
	Schultage   uint              `gorm:"not null" json:"schultage"`
}

func (Wochenfaktor) TableName() string {
	return "wochenfaktoren"
}
