import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import { Chart } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import "./einzelansicht.css";
import type {Props} from "../../../types/PathProps.ts";
import { useSchuljahr } from "../../../../services/schuljahr-context.tsx";

// -----------------------------
// Typdefinitionen
// -----------------------------
type ArbeitszeitKomponenten = {
    wochenstunden: number;
    anrechnungen: number;
    ermaessigungen: number;
    uebertrag_vorjahr: number;
    soll: number;
    ist: number;
};

type Lehrer = {
    id: number;
    vorname: string;
    nachname: string;
    kuerzel: string;
    arbeitszeit: ArbeitszeitKomponenten;
};

function ArbeitszeitChart({ komponenten }: { komponenten: ArbeitszeitKomponenten }) {
    const data: ChartData<"bar" | "line", number[], string> = {
        labels: [""],
        datasets: [
            {
                label: 'Wochenstunden',
                data: [komponenten.wochenstunden],
                backgroundColor: '#8884d8',
                stack: 'stack1',
                type: 'bar'
            },
            {
                label: 'Anrechnungen',
                data: [komponenten.anrechnungen],
                backgroundColor: '#82ca9d',
                stack: 'stack1',
                type: 'bar'
            },
            {
                label: 'Ermäßigungen',
                data: [komponenten.ermaessigungen],
                backgroundColor: '#ffc658',
                stack: 'stack1',
                type: 'bar'
            },
            {
                label: 'Übertrag Vorjahr',
                data: [komponenten.uebertrag_vorjahr],
                backgroundColor: '#ff8042',
                stack: 'stack1',
                type: 'bar'
            },
        ]
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: 'black',
                anchor: 'end' as const,
                align: 'end' as const,
                formatter: Math.round,
                font: {
                    weight: 'bold' as const
                }
            },
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true },
        },
    };

    return (
        <div style="height: 320px; width: 100%;">
            <Chart type="bar" data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
    );
}

// -----------------------------
// Hauptkomponente
// -----------------------------
export default function Einzelansicht(props: Props) {
    const [lehrer, setLehrer] = useState<Lehrer | null>(null);
    const [fehler, setFehler] = useState<string | null>(null);
    const { schuljahr } = useSchuljahr();

    const lehrerId = (props as any).id;

    useEffect(() => {
        if (!lehrerId || !schuljahr?.schuljahr_id) return;

        fetch(`/einzelansicht/${lehrerId}?schuljahr_id=${schuljahr.schuljahr_id}`)
            .then(async (res) => {
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ error: "Unbekannter Fehler" }));
                    throw new Error(err.error || `HTTP ${res.status}`);
                }
                return res.json() as Promise<Lehrer>;
            })
            .then((data) => setLehrer(data))
            .catch((err) => setFehler(err.message));
    }, [lehrerId, schuljahr]);

    if (fehler) return <p>Fehler: {fehler}</p>;
    if (!lehrer) return <p>Lade Lehrer...</p>;

    return (
        <>
            <h2>Einzelansicht</h2>
            <p><strong>Vorname:</strong> {lehrer.vorname}</p>
            <p><strong>Nachname:</strong> {lehrer.nachname}</p>
            <p><strong>Kürzel&#9733;:</strong> {lehrer.kuerzel || "Kein Kürzel vorhanden!"}</p>

            {lehrer.arbeitszeit && (
                <>
                    <h3>Arbeitszeitdiagramm</h3>
                    <ArbeitszeitChart komponenten={lehrer.arbeitszeit} />
                    <p>
                        <strong>SOLL:</strong> {lehrer.arbeitszeit.soll.toFixed(2)} Wochenstunden &nbsp;|&nbsp;
                        <strong>IST:</strong> {lehrer.arbeitszeit.ist.toFixed(2)} Wochenstunden
                    </p>
                </>
            )}

            <button
                onClick={() => route('/gesamtansicht')}
                className="back-button"
            >
                ⬅️ zurück
            </button>
        </>
    );
}
