import { useEffect, useState } from "preact/hooks";
import "./reduzierungen.css";
import type { Props } from "../../../types/PathProps.ts";

type Anrechnung = {
    anrechnung_id: number;
    kurzform: string;
    anzeigeform: string;
};

type NeueAnrechnung = {
    kurzform: string;
    anzeigeform: string;
};

export default function Anrechnungen(_: Props) {
    const [anrechnungen, setAnrechnungen] = useState<Anrechnung[]>([]);
    const [loading, setLoading] = useState(true);
    const [neueAnrechnung, setNeueAnrechnung] = useState<NeueAnrechnung>({
        kurzform: "",
        anzeigeform: "",
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Anrechnung | null>(null);

    useEffect(() => {
        fetch("/anrechnung")
            .then((res) => {
                if (!res.ok) throw new Error("Fehler beim Laden der Anrechnungen");
                return res.json();
            })
            .then((data: Anrechnung[]) => setAnrechnungen(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    function handleDoubleClick(id: number) {
        if (editId === id) {
            setEditId(null);
            setEditData(null);
        } else {
            const original = anrechnungen.find((a) => a.anrechnung_id === id);
            setEditId(id);
            setEditData({ ...original! });
        }
    }

    function handleSave() {
        if (!editData?.anzeigeform.trim()) {
            alert("Anzeigeform darf nicht leer sein.");
            return;
        }

        fetch(`/anrechnung/${editData.anrechnung_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ anzeigeform: editData.anzeigeform }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");
                return data;
            })
            .then((updated: Anrechnung) => {
                setAnrechnungen((prev) =>
                    prev.map((a) =>
                        a.anrechnung_id === updated.anrechnung_id ? updated : a
                    )
                );
                setEditId(null);
                setEditData(null);
            })
            .catch((err) => {
                alert("Fehler beim Speichern: " + err.message);
            });
    }

    function handleDelete(id: number) {
        if (!confirm("Möchten Sie diese Anrechnung wirklich löschen?")) {
            setEditId(null);
            setEditData(null);
            return;
        }

        fetch(`/anrechnung/${id}`, { method: "DELETE" })
            .then(async (res) => {
                if (!res.ok) {
                    const contentType = res.headers.get("Content-Type");
                    const isJson = contentType?.includes("application/json");
                    const data = isJson ? await res.json() : await res.text();
                    const errorMsg = isJson ? data.error : data;
                    throw new Error(errorMsg || "Löschen fehlgeschlagen");
                }

                setAnrechnungen((prev) =>
                    prev.filter((a) => a.anrechnung_id !== id)
                );
            })
            .catch((err) => {
                alert(err.message || "Fehler beim Löschen.");
            })
            .finally(() => {
                setEditId(null);
                setEditData(null);
            });
    }

    function handleAdd() {
        if (!neueAnrechnung.kurzform.trim() || !neueAnrechnung.anzeigeform.trim()) {
            alert("Bitte beide Felder ausfüllen.");
            return;
        }

        fetch("/anrechnung", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(neueAnrechnung),
        })
            .then(async (res) => {
                const contentType = res.headers.get("Content-Type");
                const isJson = contentType?.includes("application/json");
                const data = isJson ? await res.json() : await res.text();

                if (!res.ok) {
                    const errorMsg = isJson ? data.error : data;
                    throw new Error(errorMsg || "Fehler beim Speichern");
                }

                return data as Anrechnung;
            })
            .then((saved) => {
                setAnrechnungen((prev) => [...prev, saved]);
                setNeueAnrechnung({ kurzform: "", anzeigeform: "" });
            })
            .catch((err) => {
                alert("Fehler: " + err.message);
            });
    }

    if (loading) return <p>Lade Anrechnungen…</p>;

    return (
        <>
            <h1>Anrechnungen</h1>
            <table class="reduzierung-tabelle">
                <thead>
                <tr>
                    <th>Kurzform</th>
                    <th>Anzeigeform</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {anrechnungen.map((a) => (
                    <tr
                        key={a.anrechnung_id}
                        onDblClick={() => handleDoubleClick(a.anrechnung_id)}
                        style={{ cursor: "pointer" }}
                    >
                        {editId === a.anrechnung_id ? (
                            <>
                                <td data-label="Kurzform">{a.kurzform}</td>
                                <td data-label="Anzeigeform">
                                    <input
                                        value={editData?.anzeigeform || ""}
                                        onInput={(e) =>
                                            setEditData({
                                                ...editData!,
                                                anzeigeform: (e.target as HTMLInputElement).value,
                                            })
                                        }
                                        style={{ width: "100%" }}
                                    />
                                </td>
                                <td>
                                    <button
                                        class="loeschen-button"
                                        onClick={handleSave}
                                        title="Speichern"
                                    >
                                        💾
                                    </button>
                                    <button
                                        class="loeschen-button"
                                        onClick={() => {
                                            setEditId(null);
                                            setEditData(null);
                                        }}
                                        title="Abbrechen"
                                    >
                                        ❌
                                    </button>
                                    <button
                                        class="loeschen-button"
                                        onClick={() => handleDelete(a.anrechnung_id)}
                                        title="Löschen"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td data-label="Kurzform">{a.kurzform}</td>
                                <td data-label="Anzeigeform">{a.anzeigeform}</td>
                                <td></td>
                            </>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Neue Anrechnung anlegen</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAdd();
                }}
                className="lehrer-formular"
            >
                <label>
                    Kurzform:
                    <input
                        type="text"
                        value={neueAnrechnung.kurzform}
                        onInput={(e) =>
                            setNeueAnrechnung({
                                ...neueAnrechnung,
                                kurzform: (e.target as HTMLInputElement).value,
                            })
                        }
                        required
                    />
                </label>
                <label>
                    Anzeigeform:
                    <input
                        type="text"
                        value={neueAnrechnung.anzeigeform}
                        onInput={(e) =>
                            setNeueAnrechnung({
                                ...neueAnrechnung,
                                anzeigeform: (e.target as HTMLInputElement).value,
                            })
                        }
                        required
                    />
                </label>
                <button type="submit" className="back-button">
                    ➕
                </button>
            </form>
        </>
    );
}
