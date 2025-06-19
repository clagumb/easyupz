package models

import (
	"easyupz/dateutil"
)

type Schuljahr struct {
	ID          uint              `gorm:"primaryKey json:"schujahr_id"`
	Anzeigeform string            `json:"anzeigeform"`
	Beginn      dateutil.DateOnly `json:"beginn"`
	Ende        dateutil.DateOnly `json:"end"`
	Aktiv       bool              `json:"aktiv"`
	Schultage   uint              `json:"schultage"`
}

func (Schuljahr) TableName() string {
	return "schuljahre"
}
