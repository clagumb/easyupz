import { useEffect, useState } from "preact/hooks";
import {route} from "preact-router";
import {useSchuljahr} from "../../../../services/schuljahr-context.tsx";

type Lehrer = {
    vorname: string;
    nachname: string;
    kuerzel: string;
};

export default function Einzelansicht(props: any) {
    const [lehrer, setLehrer] = useState<Lehrer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const {schuljahr} = useSchuljahr();

    useEffect(() => {
        const lehrer_id = props.matches?.id;
        if (!lehrer_id) {
            setError("Keine ID übergeben");
            return;
        }

        const schuljahr_id = schuljahr?.schuljahr_id;
        if (!schuljahr_id) return;

        fetch(`/einzelansicht/${lehrer_id}?schuljahr_id=${schuljahr_id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP-Fehler: ${res.status}`);
                }
                return res.json();
            })
            .then((data: Lehrer) => {
                setLehrer(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Fehler beim Laden des Lehrers:", err);
                setError("Fehler beim Laden der Lehrerdaten.");
            });
    }, [schuljahr]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!lehrer) return <p>Lade Lehrer...</p>;

    return (
        <>
            <h2>Einzelansicht</h2>
            <p><strong>Vorname:</strong> {lehrer.vorname}</p>
            <p><strong>Nachname:</strong> {lehrer.nachname}</p>
            <p><strong>Kürzel&#9733;:</strong> {lehrer.kuerzel || "Kein Kürzel vorhanden!" }</p>
            <button
                onClick={() => route('/gesamtansicht')}
                className="back-button"
            >
                ⬅️ Zurück zur Gesamtansicht
            </button>
        </>
    );
}
