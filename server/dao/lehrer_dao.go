package dao

import "upzbayern/server/models"

var lehrer = []models.Lehrer{
	{Id: 1, Vorname: "Anna", Nachname: "Müller"},
	{Id: 2, Vorname: "Peter", Nachname: "Schmidt"},
}

func FindAll() []models.Lehrer {
	return lehrer
}
