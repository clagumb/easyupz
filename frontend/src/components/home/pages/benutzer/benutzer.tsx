import "./benutzer.css";
import type { Props } from "../../../types/PathProps.ts";
import { useEffect, useState } from "preact/hooks";

type Benutzer = {
  benutzer_id: number;
  benutzer: string;
  rolle: "";
  kuerzel: "";
};

type Rolle = "" | "admin" | "schulleitung" | "lehrkraft";
type Kuerzel = string | null;
type NeuerBenutzer = {
  benutzer: string;
  rolle: Rolle;
  passwort: string;
  kuerzel: Kuerzel;
};

export default function Benutzer(_: Props) {
  const [benutzerListe, setBenutzerListe] = useState<Benutzer[]>([]);
  const [neuerBenutzer, setNeuerBenutzer] = useState<NeuerBenutzer>({
    benutzer: "",
    rolle: "",
    passwort: "",
    kuerzel: null,
  });

  useEffect(() => {
    fetch("/benutzer")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Benutzer[]) => setBenutzerListe(data))
      .catch((err) => {
        console.error("Fehler beim Laden der Lehrerliste:", err);
        alert("Fehler beim Laden der Benutzerdaten.");
      });
  }, []);

  function handleDelete(id: number) {
    const benutzer = benutzerListe.find((b) => b.benutzer_id === id);
    if (!benutzer) return;

    if (!confirm(`Benutzer "${benutzer.benutzer}" wirklich löschen?`)) return;

    fetch(`/benutzer/${id}`, { method: "DELETE" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fehler beim Löschen");
        return data;
      })
      .then(() => {
        setBenutzerListe((prev) => prev.filter((b) => b.benutzer_id !== id));
        alert("Benutzer erfolgreich gelöscht.");
      })
      .catch((err) => {
        console.error("Fehler beim Löschen:", err);
        alert(err.message || "Unbekannter Fehler beim Löschen.");
      });
  }

  function handleAdd() {
    if (
      !neuerBenutzer.benutzer ||
      !neuerBenutzer.rolle ||
      !neuerBenutzer.passwort
    ) {
      alert("Bitte Benutzer, Rolle und Passwort ausfüllen.");
      return;
    }

    if (neuerBenutzer.rolle === "lehrkraft" && !neuerBenutzer.kuerzel) {
      alert("Bitte Kürzel ausfüllen.");
      return;
    }

    fetch("/benutzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(neuerBenutzer),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");
        return data;
      })
      .then((saved: Benutzer) => {
        setBenutzerListe((prev) => [...prev, saved]);
        setNeuerBenutzer({
          benutzer: "",
          rolle: "",
          passwort: "",
          kuerzel: null,
        });
      })
      .catch((err) => {
        alert(err.message || "Unbekannter Fehler beim Speichern.");
      });
  }

  return (
    <>
      <h1>Benutzerverwaltung</h1>
      <table id="benutzer-tabelle">
        <thead>
          <tr>
            <th>Benutzer</th>
            <th>Rolle</th>
            <th>Kürzel</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {benutzerListe.map((benutzer: Benutzer) => (
            <tr key={benutzer.benutzer_id}>
              <td data-label="Benutzer">{benutzer.benutzer}</td>
              <td data-label="Rolle">{benutzer.rolle?.toUpperCase()}</td>
              <td data-label="Kuerzel">{benutzer.kuerzel}</td>
              <td data-label="Aktion">
                <button
                  className="loeschen-button"
                  title="Benutzer löschen"
                  onClick={() => handleDelete(benutzer.benutzer_id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Neuen Benutzer anlegen</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        className="benutzer-formular"
      >
        <label>
          Benutzer:
          <input
            type="text"
            value={neuerBenutzer.benutzer}
            onInput={(e) =>
              setNeuerBenutzer({
                ...neuerBenutzer,
                benutzer: (e.target as HTMLInputElement).value,
              })
            }
            required={true}
          />
        </label>
        <label>
          Rolle:
          <select
            required={true}
            value={neuerBenutzer.rolle}
            onChange={(e) => {
              const neueRolle = (e.target as HTMLSelectElement).value as Rolle;
              setNeuerBenutzer({
                ...neuerBenutzer,
                rolle: neueRolle,
                kuerzel:
                  neueRolle === "lehrkraft" ? neuerBenutzer.kuerzel : null,
              });
            }}
          >
            <option value="" disabled hidden>
              Bitte Rolle wählen
            </option>
            <option value="admin">ADMIN</option>
            <option value="schulleitung">SCHULLEITUNG</option>
            <option value="lehrkraft">LEHRKRAFT</option>
          </select>
        </label>
        <label>
          Passwort:
          <input
            type="text"
            value={neuerBenutzer.passwort}
            onInput={(e) =>
              setNeuerBenutzer({
                ...neuerBenutzer,
                passwort: (e.target as HTMLInputElement).value,
              })
            }
            required
          />
        </label>
        {neuerBenutzer.rolle === "lehrkraft" && (
          <label>
            Kürzel:
            <input
              type="text"
              value={neuerBenutzer.kuerzel ?? ""}
              onInput={(e) =>
                setNeuerBenutzer({
                  ...neuerBenutzer,
                  kuerzel: (e.target as HTMLInputElement).value,
                })
              }
              required={true}
            />
          </label>
        )}
        <button type="submit" className="hinzufuegen-button">
          ➕
        </button>
      </form>
    </>
  );
}
