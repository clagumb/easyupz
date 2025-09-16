import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
    ChartDataLabels
);

import "./einzelansicht.css";
import type {Props} from "../../../types/PathProps.ts";

// -----------------------------
// Typdefinitionen
// -----------------------------
type ArbeitszeitKomponenten = {
    wochenstunden: number;
    anrechnungen: number;
    ermaessigungen: number;
    uebertrag_vorjahr: number;
};

type Lehrer = {
    id: number;
    vorname: string;
    nachname: string;
    kuerzel: string;
    arbeitszeit: ArbeitszeitKomponenten;
};

// -----------------------------
// Testdaten statt fetch
// -----------------------------
const TEST_LEHRER: Lehrer = {
    id: 1,
    vorname: "Max",
    nachname: "Mustermann",
    kuerzel: "MM",
    arbeitszeit: {
        wochenstunden: 24,
        anrechnungen: 2,
        ermaessigungen: 3,
        uebertrag_vorjahr: 0.56,
    }
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
        <Chart
            type="bar"
            data={data}
            options={options}
            plugins={[ChartDataLabels]}
            height={40}
        />
    );
}

// -----------------------------
// Hauptkomponente
// -----------------------------
export default function Einzelansicht(_: Props) {
    const [lehrer, setLehrer] = useState<Lehrer | null>(null);

    useEffect(() => {
        // Testdaten setzen (statt fetch)
        setLehrer(TEST_LEHRER);
    }, []);

    if (!lehrer) return <p>Lade Lehrer...</p>;

    return (
        <>
            <h2>Einzelansicht</h2>
            <p><strong>Vorname:</strong> {lehrer.vorname}</p>
            <p><strong>Nachname:</strong> {lehrer.nachname}</p>
            <p><strong>Kürzel&#9733;:</strong> {lehrer.kuerzel || "Kein Kürzel vorhanden!"}</p>

            {lehrer.arbeitszeit &&
                <>
                    <h3>Arbeitszeitdiagramm</h3>
                    <ArbeitszeitChart komponenten={lehrer.arbeitszeit} />
                </>
            }

            <button
                onClick={() => route('/gesamtansicht')}
                className="back-button"
            >
                ⬅️ zurück
            </button>
        </>
    );
}
