type Lehrer = {
    id: number;
    vorname: string;
    nachname: string;
};

// Wird dynamisch über main.ts importiert und aufgerufen, deshalb "unused"
export async function init() {
    console.log("Gesamtansicht initialisiert");

    try {
        const response = await fetch("http://localhost:8080/lehrer");

        if (!response.ok) {
            throw new Error(`Fehler beim Laden: ${response.status}`);
        }

        const lehrerListe: Lehrer[] = await response.json();

        const container = document.getElementById("gesamtansicht");
        if (!container) return;

        if (lehrerListe.length === 0) {
            container.innerHTML = "<p>Keine Lehrkräfte gefunden.</p>";
            return;
        }

        // Tabelle erzeugen
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";

        // Tabellenkopf
        table.innerHTML = `
      <thead>
        <tr>
          <th style="border: 1px solid black; padding: 4px;">Vorname</th>
          <th style="border: 1px solid black; padding: 4px;">Nachname</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

        const tbody = table.querySelector("tbody")!;

        // Datenzeilen
        for (const lehrer of lehrerListe) {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td style="border: 1px solid black; padding: 4px;">${lehrer.vorname}</td>
        <td style="border: 1px solid black; padding: 4px;">${lehrer.nachname}</td>
      `;
            tbody.appendChild(row);
        }

        container.innerHTML = ""; // vorherigen Inhalt löschen
        container.appendChild(table);

    } catch (error) {
        console.error("Fehler beim Abrufen der Lehrerdaten:", error);
    }
}
