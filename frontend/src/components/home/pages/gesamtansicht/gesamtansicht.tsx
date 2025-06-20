import {useEffect, useState} from 'preact/hooks';
import type {Props} from '../../../types/PathProps.ts';
import './gesamtansicht.css';
import {route} from "preact-router";

type Lehrer = {
    lehrer_id: number;
    lehrer_vorname: string;
    lehrer_nachname: string;
};

export default function Gesamtansicht(_: Props) {
    const [lehrerListe, setLehrerListe] = useState<Lehrer[]>([]);

    useEffect(() => {
        fetch('/gesamtansicht')
            .then((res) => res.ok ? res.json() : Promise.reject(res.status))
            .then((data: Lehrer[]) => setLehrerListe(data))
            .catch((err) => console.error('Fehler beim Laden der Lehrerliste:', err));
    }, []);
    const handleDoubleClick = (id: number) => {
        alert(id);
        route(`/lehrer/${id}`);
    };

    return (
        <>
            <h1>Gesamtansicht</h1>

            <table id="lehrer-tabelle">
                <thead>
                <tr>
                    <th>Vorname</th>
                    <th>Nachname</th>
                </tr>
                </thead>
                <tbody>
                {lehrerListe.map((lehrer) => (
                    <tr key={lehrer.lehrer_id}>
                        <td>{lehrer.lehrer_vorname}</td>
                        <td
                            onDblClick={() => handleDoubleClick(lehrer.lehrer_id)}
                            style={{cursor: 'pointer'}}
                        >{lehrer.lehrer_nachname}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}
