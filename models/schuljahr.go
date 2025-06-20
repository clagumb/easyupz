package models

import (
	"easyupz/dateutil"
)

type Schuljahr struct {
	ID          uint              `gorm:"primaryKey" json:"schuljahr_id"`
	Anzeigeform string            `json:"anzeigeform"`
	Beginn      dateutil.DateOnly `json:"beginn"`
	Ende        dateutil.DateOnly `json:"ende"`
	Aktiv       bool              `json:"aktiv"`
	Schultage   uint              `json:"schultage"`
}

func (Schuljahr) TableName() string {
	return "schuljahre"
}
