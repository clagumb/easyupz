package main

import (
	"embed"
	"fmt"
	"upzbayern/router"
	"upzbayern/services"
)

//go:embed start/*
var staticFiles embed.FS

//go:embed start/index.html
var indexHtml []byte

func main() {
	services.Init()
	/*
		err := services.RegisterBenutzer("admin", "!!UPZ!!", "admin")
		if err != nil {
			fmt.Println("Fehler bei Registrierung:", err)
		}
			err := services.RegisterBenutzer("lehrkraft", "lehrkraft", "lehrkraft")
			if err != nil {
				fmt.Println("Fehler bei Registrierung:", err)
			}
			err = services.RegisterBenutzer("seki", "seki123!", "verwaltung")
			if err != nil {
				fmt.Println("Fehler bei Registrierung:", err)
			}

			user, err := services.Login("admin", "!!UPZ!!")
			if err != nil {
				fmt.Println("Login fehlgeschlagen:", err)
			} else {
				fmt.Println("Login erfolgreich! Benutzer:", user.Benutzer, "Rolle:", user.Rolle)
			}
	*/

	r := router.Setup(staticFiles, indexHtml)

	// Config-Loader beginn
	loader, err := services.NewConfigLoader()
	if err != nil {
		panic("konfiguration konnte nicht geladen werden: " + err.Error())
	}

	ip := loader.GetValue("server", "ip")
	port := loader.GetValue("server", "port")
	address := fmt.Sprintf("%s:%s", ip, port)

	fmt.Println("Server läuft auf http://" + address)
	err = r.Run(address)
	if err != nil {
		fmt.Println("Fehler beim Starten des Servers ", err)
		return
	}
}
