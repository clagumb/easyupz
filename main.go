package main

import (
	"easyupz/router"
	"easyupz/services"
	"embed"
	"fmt"
)

//go:embed start/*
var staticFiles embed.FS

//go:embed start/index.html
var indexHtml []byte

func main() {
	services.Init()
	r := router.Setup(staticFiles, indexHtml)

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
