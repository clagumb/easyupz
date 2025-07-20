import { useEffect, useState } from "preact/hooks";
import "./reduzierungen.css";
import type { Props } from "../../../types/PathProps.ts";

type Anrechnung = {
    anrechnung_id: number;
    kurzform: string;
    anzeigeform: string;
};

export default function Anrechnungen(_: Props) {
    const [anrechnungen, setAnrechnungen] = useState<Anrechnung[]>([]);
    const [loading, setLoading] = useState(true);

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
        console.log("Doppelklick auf Anrechnung mit ID:", id);
        // Hier kannst du später z. B. eine Bearbeitungsmaske öffnen
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
                </tr>
                </thead>
                <tbody>
                {anrechnungen.map((a) => (
                    <tr
                        key={a.anrechnung_id}
                        onDblClick={() => handleDoubleClick(a.anrechnung_id)}
                        style={{ cursor: "pointer" }}
                    >
                        <td data-label="Kurzform">{a.kurzform}</td>
                        <td data-label="Anzeigeform">{a.anzeigeform}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}
