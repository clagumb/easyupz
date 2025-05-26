export async function init() {
    console.log("Gesamtansicht initialisiert");
    try {
        const response = await fetch("http://localhost:8080/lehrer");
        if (!response.ok)
            throw new Error(`Fehler beim Laden: ${response.status}`);
        const lehrerListe = await response.json();
        const tbody = document.querySelector("#lehrer-tabelle tbody");
        const template = document.getElementById("lehrer-zeile");
        if (!tbody || !template)
            return;
        tbody.innerHTML = ""; // Tabelle leeren
        for (const lehrer of lehrerListe) {
            const clone = template.content.cloneNode(true);
            clone.querySelector(".vorname").textContent =
                lehrer.vorname;
            clone.querySelector(".nachname").textContent =
                lehrer.nachname;
            tbody.appendChild(clone);
        }
    }
    catch (err) {
        console.error("Fehler beim Laden der Lehrerliste:", err);
    }
}
