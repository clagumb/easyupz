import { useEffect, useState } from "preact/hooks";
import "./reduzierungen.css";
import type { Props } from "../../../types/PathProps.ts";

type Ermaessigung = {
    ermaessigung_id: number;
    kurzform: string;
    anzeigeform: string;
};

type NeueErmaessigung = {
    kurzform: string;
    anzeigeform: string;
};

export default function Ermaessigungen(_: Props) {
    const [ermaessigungen, setErmaessigungen] = useState<Ermaessigung[]>([]);
    const [loading, setLoading] = useState(true);
    const [neueErmaessigung, setNeueErmaessigung] = useState<NeueErmaessigung>({
        kurzform: "",
        anzeigeform: "",
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Ermaessigung | null>(null);

    useEffect(() => {
        fetch("/ermaessigung")
            .then((res) => {
                if (!res.ok) throw new Error("Fehler beim Laden der Ermäßigungen");
                return res.json();
            })
            .then((data: Ermaessigung[]) => setErmaessigungen(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    function handleDoubleClick(id: number) {
        if (editId === id) {
            setEditId(null);
            setEditData(null);
        } else {
            const original = ermaessigungen.find((e) => e.ermaessigung_id === id);
            setEditId(id);
            setEditData({ ...original! });
        }
    }

    function handleSave() {
        if (!editData?.anzeigeform.trim()) {
            alert("Anzeigeform darf nicht leer sein.");
            return;
        }

        fetch(`/ermaessigung/${editData.ermaessigung_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ anzeigeform: editData.anzeigeform }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");
                return data;
            })
            .then((updated: Ermaessigung) => {
                setErmaessigungen((prev) =>
                    prev.map((e) =>
                        e.ermaessigung_id === updated.ermaessigung_id ? updated : e
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
        if (!confirm("Möchten Sie diese Ermäßigung wirklich löschen?")) {
            setEditId(null);
            setEditData(null);
            return;
        }

        fetch(`/ermaessigung/${id}`, { method: "DELETE" })
            .then(async (res) => {
                if (!res.ok) {
                    const contentType = res.headers.get("Content-Type");
                    const isJson = contentType?.includes("application/json");
                    const data = isJson ? await res.json() : await res.text();
                    const errorMsg = isJson ? data.error : data;
                    throw new Error(errorMsg || "Löschen fehlgeschlagen");
                }

                setErmaessigungen((prev) =>
                    prev.filter((e) => e.ermaessigung_id !== id)
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
        if (!neueErmaessigung.kurzform.trim() || !neueErmaessigung.anzeigeform.trim()) {
            alert("Bitte beide Felder ausfüllen.");
            return;
        }

        fetch("/ermaessigung", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(neueErmaessigung),
        })
            .then(async (res) => {
                const contentType = res.headers.get("Content-Type");
                const isJson = contentType?.includes("application/json");
                const data = isJson ? await res.json() : await res.text();

                if (!res.ok) {
                    const errorMsg = isJson ? data.error : data;
                    throw new Error(errorMsg || "Fehler beim Speichern");
                }

                return data as Ermaessigung;
            })
            .then((saved) => {
                setErmaessigungen((prev) => [...prev, saved]);
                setNeueErmaessigung({ kurzform: "", anzeigeform: "" });
            })
            .catch((err) => {
                alert("Fehler: " + err.message);
            });
    }

    if (loading) return <p>Lade Ermäßigungen…</p>;

    return (
        <>
            <h1>Ermäßigungen</h1>
            <table class="reduzierung-tabelle">
                <thead>
                <tr>
                    <th>Kurzform</th>
                    <th>Anzeigeform</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {ermaessigungen.map((e) => (
                    <tr
                        key={e.ermaessigung_id}
                        onDblClick={() => handleDoubleClick(e.ermaessigung_id)}
                        style={{ cursor: "pointer" }}
                    >
                        {editId === e.ermaessigung_id ? (
                            <>
                                <td data-label="Kurzform">{e.kurzform}</td>
                                <td data-label="Anzeigeform">
                                    <input
                                        value={editData?.anzeigeform || ""}
                                        onInput={(ev) =>
                                            setEditData({
                                                ...editData!,
                                                anzeigeform: (ev.target as HTMLInputElement).value,
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
                                        onClick={() => handleDelete(e.ermaessigung_id)}
                                        title="Löschen"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td data-label="Kurzform">{e.kurzform}</td>
                                <td data-label="Anzeigeform">{e.anzeigeform}</td>
                                <td></td>
                            </>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Neue Ermäßigung anlegen</h2>
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
                        value={neueErmaessigung.kurzform}
                        onInput={(e) =>
                            setNeueErmaessigung({
                                ...neueErmaessigung,
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
                        value={neueErmaessigung.anzeigeform}
                        onInput={(e) =>
                            setNeueErmaessigung({
                                ...neueErmaessigung,
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
