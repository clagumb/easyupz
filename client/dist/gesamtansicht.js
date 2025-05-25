export async function init() {
    console.log("Gesamtansicht initialisiert");
    try {
        const response = await fetch("http://localhost:8080/lehrer");
        if (!response.ok) {
            throw new Error(`Fehler beim Laden: ${response.status}`);
        }
        const lehrerListe = await response.json();
        const container = document.getElementById("gesamtansicht");
        if (!container)
            return;
        if (lehrerListe.length === 0) {
            container.innerHTML = "<p>Keine Lehrkräfte gefunden.</p>";
            return;
        }
        // HTML-Liste erzeugen
        const ul = document.createElement("ul");
        for (const lehrer of lehrerListe) {
            const li = document.createElement("li");
            li.textContent = `${lehrer.vorname} ${lehrer.nachname}`;
            ul.appendChild(li);
        }
        container.appendChild(ul);
    }
    catch (error) {
        console.error("Fehler beim Abrufen der Lehrerdaten:", error);
    }
}
