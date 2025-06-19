import "./lehrerverwaltung.css";
import type {Props} from "../../../types/PathProps.tsx";
import {useEffect, useState} from "preact/hooks";
import dayjs from "dayjs";

type Lehrer = {
    lehrer_id: number;
    vorname: string;
    nachname: string;
    geburtsdatum: string;
    dienstverhaeltnis: string;
    qualifikationsebene: number;
    stammschule: string;
};

type NeuerLehrer = {
    vorname: string;
    nachname: string;
    geburtsdatum: string;
    dienstverhaeltnis: string;
    qualifikationsebene: number;
    stammschule: string;
};

export default function Lehrerverwaltung(_: Props) {
    const [lehrerListe, setLehrerListe] = useState<Lehrer[]>([]);
    const [neuerLehrer, setNeuerLehrer] = useState<NeuerLehrer>({
        vorname: "",
        nachname: "",
        geburtsdatum: "",
        dienstverhaeltnis: "",
        qualifikationsebene: 0,
        stammschule: "",
    });

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
    */
    function handleAdd() {
        if (
            !neuerLehrer.nachname ||
            !neuerLehrer.dienstverhaeltnis ||
            !neuerLehrer.qualifikationsebene ||
            !neuerLehrer.stammschule
        ) {
            alert("Bitte Nachname, Dienstverhältnis, Qualifikationseben und Stammschule ausfüllen.");
            return;
        }

        fetch("/lehrerverwaltung", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(neuerLehrer),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");
                return data;
            })
            .then((saved: Lehrer) => {
                setLehrerListe((prev) => [...prev, saved]);
                setNeuerLehrer({
                    vorname: "",
                    nachname: "",
                    geburtsdatum: "",
                    dienstverhaeltnis: "",
                    qualifikationsebene: 0,
                    stammschule: "",
                });
            })
            .catch((err) => {
                alert(err.message || "Unbekannter Fehler beim Speichern.");
            });
    }

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
                    <tr key={lehrer.lehrer_id}>
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
            <h2>Neue Lehrkraft anlegen</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAdd();
                }}
                className="lehrer-formular"
            >
                <label>
                    Vorname:
                    <input
                        type="text"
                        value={neuerLehrer.vorname}
                        onInput={(e) =>
                            setNeuerLehrer({
                                ...neuerLehrer,
                                vorname: (e.target as HTMLInputElement).value,
                            })
                        }
                        required={false}
                    />
                </label>
                <label>
                    Nachname:
                    <input
                        type="text"
                        value={neuerLehrer.nachname}
                        onInput={(e) =>
                            setNeuerLehrer({
                                ...neuerLehrer,
                                nachname: (e.target as HTMLInputElement).value,
                            })
                        }
                        required={true}
                    />
                </label>
                <label>
                    Geburtsdatum:
                    <input
                        type="date"
                        value={neuerLehrer.geburtsdatum}
                        onInput={(e) =>
                            setNeuerLehrer({
                                ...neuerLehrer,
                                geburtsdatum: (e.target as HTMLInputElement).value,
                            })
                        }
                        required={true}
                    />
                </label>
                <label>
                    Dienstverhältnis:
                    <select
                        required={true}
                        value={neuerLehrer.dienstverhaeltnis}
                        onChange={(e) => {
                            setNeuerLehrer({
                                ...neuerLehrer,
                                dienstverhaeltnis: (e.target as HTMLInputElement).value,
                            });
                        }}
                    >
                        <option value="" disabled hidden>
                            Bitte Dienstverhältnis wählen
                        </option>
                        <option value="ab">angestellt befristet (ab)</option>
                        <option value="bl">Beamter auf Lebenzeit (bl)</option>
                    </select>
                </label>
                <label>
                    Qualtifikationsebene:
                    <select
                        required={true}
                        value={neuerLehrer.qualifikationsebene}
                        onChange={(e) => {
                            setNeuerLehrer({
                                ...neuerLehrer,
                                qualifikationsebene: Number((e.target as HTMLInputElement).value),
                            });
                        }}
                    >
                        <option value="" disabled hidden>
                            Bitte Qualifikationseben wählen
                        </option>
                        <option value="4">QE4</option>
                        <option value="3">QE3</option>
                    </select>
                </label>
                <label>
                    Schulnummer der Stammschule:
                    <input
                        type="text"
                        value={neuerLehrer.stammschule}
                        onInput={(e) =>
                            setNeuerLehrer({
                                ...neuerLehrer,
                                stammschule: (e.target as HTMLInputElement).value,
                            })
                        }
                        required={true}
                    />
                </label>
                <button type="submit" className="hinzufuegen-button">
                    ➕
                </button>
            </form>
        </>
    )
        ;
}
