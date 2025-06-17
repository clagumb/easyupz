import "./lehrerverwaltung.css";
import type { Props } from "../../../types/PathProps.tsx";
import { useEffect, useState } from "preact/hooks";
import dayjs from "dayjs";

type Lehrer = {
  id: number;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  dienstverhaeltnis: string | null;
  qualifikationsebene: number;
  stammschule: string;
};

/*
type NeuerLehrer = {
    vorname: string;
    nachname: string;
    geburtsdatum: string;
    dienstverhaeltnis: string | null;
    qualifikationsebene: number;
    stammschule: number
};
*/

export default function Lehrerverwaltung(_: Props) {
  const [lehrerListe, setLehrerListe] = useState<Lehrer[]>([]);
  /*
  const [neuerBenutzer, setNeuerLehrer] = useState<NeuerLehrer>({
      vorname: "",
      nachname: "",
      geburtsdatum: "",
      dienstverhaeltnis: null,
      qualifikationsebene: 0,
      stammschule: 0
  });
*/

  useEffect(() => {
    fetch("/lehrerverwaltung")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Lehrer[]) => setLehrerListe(data))
      .catch((err) => {
        console.error("Fehler beim Laden der Lehrerliste:", err);
        alert("Fehler beim Laden der Benutzerdaten.");
      });
  }, []);

  /*
  function handleDelete(id: number) {
    const benutzer = benutzerListe.find((b) => b.id === id);
    if (!benutzer) return;

    if (!confirm(`Benutzer "${benutzer.benutzer}" wirklich löschen?`)) return;

    fetch(`/benutzer/${id}`, { method: "DELETE" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fehler beim Löschen");
        return data;
      })
      .then(() => {
        setBenutzerListe((prev) => prev.filter((b) => b.id !== id));
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
  */
  return (
    <>
      <h1>Lehrerverwaltung</h1>
      <table id="lehrer-tabelle">
        <thead>
          <tr>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Geburtsdatum</th>
            <th>Dienstverhältnis</th>
              <th>QE</th>
              <th>Stammschule</th>
          </tr>
        </thead>
        <tbody>
          {lehrerListe.map((lehrer: Lehrer) => (
            <tr key={lehrer.id}>
              <td data-label="Vorname">{lehrer.vorname}</td>
              <td data-label="Nachname">{lehrer.nachname}</td>
              <td data-label="Geburtsdatum">{dayjs(lehrer.geburtsdatum).format("DD.MM.YYYY")}</td>
                <td data-label="Dienstverhaeltnis">{lehrer.dienstverhaeltnis}</td>
                <td data-label="Qualifikationsebene">{lehrer.qualifikationsebene}</td>
                <td data-label="Stammschuke">{lehrer.stammschule}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </>
  );
}
