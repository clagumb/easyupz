import type {Props} from "../../../types/PathProps.ts";
import {useEffect, useState} from "preact/hooks";
import dayjs from "dayjs";
import {useSchuljahr} from "../../../../services/schuljahr-context.tsx";

import "./lehrerverwaltung.css";

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

type LehrerUpdatePayload = {
    alt: {
        kuerzel: string;
        schulnummer: string;
    };
    neu: {
        vorname: string;
        nachname: string;
        geburtsdatum: string; // Format: "YYYY-MM-DD"
        dienstverhaeltnis: string;
        qualifikationsebene: string;
        schulnummer: string;
        kuerzel: string;
        schuljahr: {
            schuljahr_id: number;
        };
    };
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
    const {schuljahr} = useSchuljahr();
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Lehrer | null>(null);
    const [originalValues, setOriginalValues] = useState({
        kuerzel: "",
        schulnummer: "",
    });
    const dienstverhaeltnisse = [
        {value: "ab", label: "angestellt befristet (ab)"},
        {value: "bl", label: "Beamter auf Lebenszeit (bl)"},
    ];
    const qualifikationsebene = [
        {value: "QE4", label: "QE4"},
        {value: "QE3", label: "QE3"},
    ];

    useEffect(() => {
        const id = schuljahr?.schuljahr_id;
        if (!id) return;

        const loadLehrer = async () => {
            try {
                const res = await fetch(`/lehrerverwaltung?schuljahr_id=${id}`);
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || `Fehler beim Laden (HTTP ${res.status})`);
                }
                const text = await res.text();
                if (!text) {
                    setLehrerListe([]);
                    return;
                }
                const data: Lehrer[] = JSON.parse(text);
                setLehrerListe(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error("Fehler beim Laden der Lehrerliste:", err);
                alert("Fehler beim Laden der Lehrerliste: " + err.message);
            }
        };

        loadLehrer();
    }, [schuljahr]);

    function handleAdd() {
        console.log("Neuer Lehrer:", neuerLehrer);
        const fehlt = [
            neuerLehrer.vorname,
            neuerLehrer.nachname,
            neuerLehrer.dienstverhaeltnis,
            neuerLehrer.qualifikationsebene,
            neuerLehrer.schulnummer,
            neuerLehrer.kuerzel,
        ].some((feld) => !feld || feld.trim() === "");

        if (fehlt) {
            alert("Bitte alle Felder ausfüllen.");
            return;
        }

        fetch("/lehrerverwaltung", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
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
                const {lehrer, lehrereinsatz} = saved;
                if (
                    lehrereinsatz.schuljahr_id === schuljahr?.schuljahr_id &&
                    lehrereinsatz.schulnummer === lehrer.schulnummer
                ) {
                    setLehrerListe((prev) => [
                        ...prev,
                        {...lehrer, kuerzel: lehrereinsatz.kuerzel},
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

    function handleSave(editData: Lehrer) {
        if (
            !editData.vorname?.trim() ||
            !editData.nachname?.trim() ||
            !editData.geburtsdatum?.trim() ||
            !editData.dienstverhaeltnis?.trim() ||
            !editData.qualifikationsebene?.trim() ||
            !editData.schulnummer?.trim() ||
            !editData.kuerzel?.trim()
        ) {
            alert("Bitte alle Felder ausfüllen.");
            return;
        }

        const {lehrer_id, ...rest} = editData;
        const payload: LehrerUpdatePayload = {
            alt: originalValues,
            neu: {
                ...rest,
                schuljahr: {
                    schuljahr_id: schuljahr?.schuljahr_id!,
                },
            },
        };

        fetch(`/lehrerverwaltung/${lehrer_id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Fehler beim Speichern");
                }
                return fetch(`/lehrerverwaltung?schuljahr_id=${schuljahr?.schuljahr_id}`);
            })
            .then((res) => res.json())
            .then((data: Lehrer[]) => {
                setLehrerListe(data);
                setEditId(null);
            })
            .catch((err) => {
                alert("Speichern fehlgeschlagen: " + err.message);
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
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {lehrerListe.map((lehrer: Lehrer) => (
                    <tr key={lehrer.lehrer_id}
                        onDblClick={() => {
                            setEditId(lehrer.lehrer_id);
                            setOriginalValues({
                                kuerzel: lehrer.kuerzel,
                                schulnummer: lehrer.schulnummer,
                            });
                            setEditData({...lehrer});
                        }}
                    >
                        {editId === lehrer.lehrer_id ? (
                            <>
                                <td>
                                    <input
                                        value={editData?.vorname ?? ""}
                                        onInput={(e) =>
                                            editData && setEditData({...editData, vorname: e.currentTarget.value})
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.currentTarget.blur();
                                            }
                                        }}
                                        style={{width: "15ch"}}
                                    />
                                </td>
                                <td>
                                    <input
                                        value={editData?.nachname ?? ""}
                                        onInput={(e) =>
                                            editData && setEditData({...editData, nachname: e.currentTarget.value})
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.currentTarget.blur();
                                            }
                                        }}
                                        style={{width: "15ch"}}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={editData?.geburtsdatum
                                            ? dayjs(editData.geburtsdatum).format("YYYY-MM-DD")
                                            : ""}
                                        onInput={(e) =>
                                            editData && setEditData({...editData, geburtsdatum: e.currentTarget.value})
                                        }
                                    />
                                </td>
                                <td>
                                    <select
                                        value={editData?.dienstverhaeltnis ?? ""}
                                        onInput={(e) =>
                                            editData && setEditData({
                                                ...editData,
                                                dienstverhaeltnis: e.currentTarget.value
                                            })
                                        }
                                    >
                                        {dienstverhaeltnisse.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={editData?.qualifikationsebene ?? ""}
                                        onInput={(e) =>
                                            editData && setEditData({
                                                ...editData,
                                                qualifikationsebene: e.currentTarget.value
                                            })
                                        }
                                    >
                                        {qualifikationsebene.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        value={editData?.schulnummer ?? ""}
                                        onInput={(e) =>
                                            editData && setEditData({...editData, schulnummer: e.currentTarget.value})
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.currentTarget.blur();
                                            }
                                        }}
                                        inputMode="numeric"
                                        pattern="\d*"
                                        maxLength={5}
                                        style={{width: "6ch"}}
                                    />
                                </td>
                                <td>
                                    <input
                                        value={editData?.kuerzel ?? ""}
                                        onInput={(e) =>
                                            editData && setEditData({...editData, kuerzel: e.currentTarget.value})
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.currentTarget.blur();
                                            }
                                        }}
                                        style={{width: "6ch"}}
                                    />
                                </td>
                                <td>
                                    <button className={"back-button"}
                                            onClick={() => editData && handleSave(editData)}>💾
                                    </button>
                                    <button className={"back-button"} onClick={() => setEditId(null)}>❌</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{lehrer.vorname}</td>
                                <td>{lehrer.nachname}</td>
                                <td>{dayjs(lehrer.geburtsdatum).format("DD.MM.YYYY")}</td>
                                <td>{lehrer.dienstverhaeltnis}</td>
                                <td>{lehrer.qualifikationsebene}</td>
                                <td>{lehrer.schulnummer}</td>
                                <td>{lehrer.kuerzel}</td>
                                <td></td>
                            </>
                        )}
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
                        required={true}
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
                        {dienstverhaeltnisse.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                            >
                                {opt.label}
                            </option>
                        ))}
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
                        {qualifikationsebene.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                            >
                                {opt.label}
                            </option>
                        ))}
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
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={5}
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
                <button type="submit" className="back-button">
                    ➕
                </button>
            </form>
        </>
    )
        ;
}
