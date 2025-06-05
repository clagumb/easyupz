import { setReloading } from "./session.js";

type Anrechnung = {
  id: number;
  kurzform: string;
  anzeigeform: string;
  langform: string;
};

export async function init() {
  console.log("Anrechnungen initialisiert");

  try {
    const response = await fetch("/anrechnungen");

    if (!response.ok) throw new Error(`Fehler beim Laden: ${response.status}`);

    const anrechnungen: Anrechnung[] = await response.json();

    const tbody = document.querySelector("#anrechnungen-tabelle tbody");
    const template = document.getElementById(
      "anrechnung-zeile",
    ) as HTMLTemplateElement;

    if (!tbody || !template) return;

    tbody.innerHTML = "";

    for (const anrechnung of anrechnungen) {
      const clone = template.content.cloneNode(true) as HTMLElement;
      (clone.querySelector(".kurzform") as HTMLElement).textContent =
        anrechnung.kurzform;
      (clone.querySelector(".anzeigeform") as HTMLElement).textContent =
        anrechnung.anzeigeform;
      (clone.querySelector(".langform") as HTMLElement).textContent =
        anrechnung.langform;
      tbody.appendChild(clone);
    }
  } catch (err) {
    console.error("Fehler beim Laden der Lehrerliste:", err);
  }
  createEingabezeile();
}

function createEingabezeile() {
  const tbody = document.querySelector("#anrechnungen-tabelle tbody");
  if (!tbody) return;

  const zeile = document.createElement("tr");

  const kurzformInput = document.createElement("input");
  const anzeigeformInput = document.createElement("input");
  const langformInput = document.createElement("input");

  const kurzformTd = document.createElement("td");
  kurzformTd.appendChild(kurzformInput);

  const anzeigeformTd = document.createElement("td");
  anzeigeformTd.appendChild(anzeigeformInput);

  const langformTd = document.createElement("td");
  langformTd.appendChild(langformInput);

  const buttonTd = document.createElement("td");
  const saveButton = document.createElement("button");
  saveButton.textContent = "+";
  saveButton.style.display = "none";
  buttonTd.appendChild(saveButton);

  zeile.append(kurzformTd, anzeigeformTd, langformTd, buttonTd);
  tbody.appendChild(zeile);

  function checkInputs() {
    const allFilled =
      kurzformInput.value.trim() &&
      anzeigeformInput.value.trim() &&
      langformInput.value.trim();
    saveButton.style.display = allFilled ? "inline" : "none";
  }

  kurzformInput.addEventListener("input", checkInputs);
  anzeigeformInput.addEventListener("input", checkInputs);
  langformInput.addEventListener("input", checkInputs);

  saveButton.addEventListener("click", async () => {
    const data = {
      kurzform: kurzformInput.value.trim(),
      anzeigeform: anzeigeformInput.value.trim(),
      langform: langformInput.value.trim(),
    };

    try {
      const response = await fetch("/anrechnung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await init();
      } else {
        throw new Error(`Fehler beim Speichern: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
    }
  });
}
