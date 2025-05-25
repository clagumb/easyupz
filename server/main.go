package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		n, err := fmt.Fprintln(w, "Hallo aus Go2!")
		if err != nil {
			fmt.Println("Fehler beim Schreiben: ", err)
			return
		}
		fmt.Println("Anzahl der geschriebenen Bytes: ", n)
	})
	fmt.Println("Server läuft auf http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Der Server ist nicht gestartet: ", err)
		return
	}
}
