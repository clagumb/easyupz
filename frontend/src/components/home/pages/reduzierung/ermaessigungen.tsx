import { useEffect, useState } from "preact/hooks";
import "./reduzierungen.css";
import type { Props } from "../../../types/PathProps.ts";

type Ermaessigung = {
    ermaessigung_id: number;
    kurzform: string;
    anzeigeform: string;
};

export default function Ermaessigungen(_: Props) {
    const [ermaessigungen, setErmaessigungen] = useState<Ermaessigung[]>([]);
    const [loading, setLoading] = useState(true);

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
        console.log("Doppelklick auf Ermäßigung mit ID:", id);
        // z. B. Modal öffnen oder Bearbeitungsansicht
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
                </tr>
                </thead>
                <tbody>
                {ermaessigungen.map((e) => (
                    <tr
                        key={e.ermaessigung_id}
                        onDblClick={() => handleDoubleClick(e.ermaessigung_id)}
                        style={{ cursor: "pointer" }}
                    >
                        <td data-label="Kurzform">{e.kurzform}</td>
                        <td data-label="Anzeigeform">{e.anzeigeform}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}
