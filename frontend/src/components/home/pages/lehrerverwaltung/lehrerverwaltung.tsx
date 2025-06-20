import "./lehrerverwaltung.css";
import type {Props} from "../../../types/PathProps.ts";
import {useEffect, useState} from "preact/hooks";
import dayjs from "dayjs";
import { useSchuljahr } from "../../../../services/schuljahr-context.tsx";

type Lehrer = {
    lehrer_id: number;
    vorname: string;
    nachname: string;
    geburtsdatum: string;
    dienstverhaeltnis: string;
    qualifikationsebene: string;
    schulnummer: string;
    kuerzel: string;
};

type NeuerLehrer = {
    vorname: string;
    nachname: string;
    geburtsdatum: string;
    dienstverhaeltnis: string;
    qualifikationsebene: string;
    schulnummer: string;
    kuerzel: string;
};

export default function Lehrerverwaltung(_: Props) {
    const [lehrerListe, setLehrerListe] = useState<Lehrer[]>([]);
    const [neuerLehrer, setNeuerLehrer] = useState<NeuerLehrer>({
        vorname: "",
        nachname: "",
        geburtsdatum: "",
        dienstverhaeltnis: "",
        qualifikationsebene: "",
        schulnummer: "",
        kuerzel: "",
    });
    const { schuljahr } = useSchuljahr();

    useEffect(() => {
        if (!schuljahr?.schuljahr_id) return;
        fetch(`/lehrerverwaltung?schuljahr_id=${schuljahr.schuljahr_id}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
            .then((data: Lehrer[]) => setLehrerListe(data))
            .catch((err) => {
                console.error("Fehler beim Laden der Lehrerliste:", err);
                alert("Fehler beim Laden der Benutzerdaten.");
            });
    }, [schuljahr?.schuljahr_id]);

    function handleAdd() {
        if (
            !neuerLehrer.nachname ||
            !neuerLehrer.dienstverhaeltnis ||
            !neuerLehrer.qualifikationsebene ||
            !neuerLehrer.schulnummer ||
            !neuerLehrer.kuerzel
        ) {
            alert("Bitte Nachname, Dienstverhältnis, Qualifikationseben, Stammschule und Kürzel ausfüllen.");
            return;
        }

        fetch("/lehrerverwaltung", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...neuerLehrer,
                schuljahr
            }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");
                return data;
            })
            .then((saved) => {
                const { lehrer, lehrereinsatz } = saved;
                if (
                    lehrereinsatz.schuljahr_id === schuljahr?.schuljahr_id &&
                    lehrereinsatz.schulnummer === lehrer.schulnummer
                ) {
                    setLehrerListe((prev) => [
                        ...prev,
                        { ...lehrer, kuerzel: lehrereinsatz.kuerzel },
                    ]);
                } else {
                    setLehrerListe((prev) => [...prev, lehrer]);
                }

                setNeuerLehrer({
                    vorname: "",
                    nachname: "",
                    geburtsdatum: "",
                    dienstverhaeltnis: "",
                    qualifikationsebene: "",
                    schulnummer: "",
                    kuerzel: "",
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
                    <th>Kürzel&#9733;</th>
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
                        <td data-label="Stammschule">{lehrer.schulnummer}</td>
                        <td data-label="Kuerzel">{lehrer.kuerzel}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <span className={"fussnote"}>Werte mit &#9733; haben Schuljahresbezug</span>
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
                                qualifikationsebene: (e.target as HTMLInputElement).value,
                            });
                        }}
                    >
                        <option value="" disabled hidden>
                            Bitte Qualifikationsebene wählen
                        </option>
                        <option value="QE4">QE4</option>
                        <option value="QE3">QE3</option>
                    </select>
                </label>
                <label>
                    Schulnummer der Stammschule:
                    <input
                        type="text"
                        value={neuerLehrer.schulnummer}
                        onInput={(e) =>
                            setNeuerLehrer({
                                ...neuerLehrer,
                                schulnummer: (e.target as HTMLInputElement).value,
                            })
                        }
                        required={true}
                    />
                </label>
                <label>
                    Kürzel an der Stammschule:&#9733;
                    <input
                        type="text"
                        value={neuerLehrer.kuerzel}
                        onInput={(e) =>
                            setNeuerLehrer({
                                ...neuerLehrer,
                                kuerzel: (e.target as HTMLInputElement).value,
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
