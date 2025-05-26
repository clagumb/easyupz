type Lehrer = {
  id: number;
  vorname: string;
  nachname: string;
};

export async function init() {
  console.log("Gesamtansicht initialisiert");

  try {
    const response = await fetch("http://localhost:8080/lehrer");

    if (!response.ok) throw new Error(`Fehler beim Laden: ${response.status}`);

    const lehrerListe: Lehrer[] = await response.json();

    const tbody = document.querySelector("#lehrer-tabelle tbody");
    const template = document.getElementById(
      "lehrer-zeile",
    ) as HTMLTemplateElement;

    if (!tbody || !template) return;

    tbody.innerHTML = ""; // Tabelle leeren

    for (const lehrer of lehrerListe) {
      const clone = template.content.cloneNode(true) as HTMLElement;
      (clone.querySelector(".vorname") as HTMLElement).textContent =
        lehrer.vorname;
      (clone.querySelector(".nachname") as HTMLElement).textContent =
        lehrer.nachname;
      tbody.appendChild(clone);
    }
  } catch (err) {
    console.error("Fehler beim Laden der Lehrerliste:", err);
  }
}
