import './gesamtansicht.css';

import {useEffect, useState} from 'preact/hooks';
import type {Props} from '../../../types/PathProps.ts';
import {route} from "preact-router";
import {useSchuljahr} from "../../../../services/schuljahr-context.tsx";

type Lehrer = {
    lehrer_id: number;
    vorname: string;
    nachname: string;
    soll_wochenstunden: number;
    ist_wochenstunden: number;
};

export default function Gesamtansicht(_: Props) {
    const [lehrerListe, setLehrerListe] = useState<Lehrer[]>([]);
    const {schuljahr} = useSchuljahr();

    useEffect(() => {
        const id = schuljahr?.schuljahr_id;
        if (!id) return;

        fetch(`/gesamtansicht?schuljahr_id=${id}`)
            .then((res) => res.ok ? res.json() : Promise.reject(res.status))
            .then((data: Lehrer[]) => setLehrerListe(data))
            .catch((err) => console.error('Fehler beim Laden der Lehrerliste:', err));
    }, [schuljahr]);

    useEffect(() => {
        const savedY = sessionStorage.getItem("scrollY");
        const main = document.querySelector("main");

        if (savedY && main && lehrerListe.length > 0) {
            main.scrollTop = parseInt(savedY);
            sessionStorage.removeItem("scrollY");
        }
    }, [lehrerListe]);

    const handleDoubleClick = (id: number) => {
        const main = document.querySelector("main");
        if (main) {
            sessionStorage.setItem("scrollY", main.scrollTop.toString());
        }
        route(`/einzelansicht/${id}`);
    };

    return (
        <>
            <h1>Gesamtansicht</h1>

            <table id="lehrer-tabelle">
                <thead>
                <tr>
                    <th>Vorname</th>
                    <th>Nachname</th>
                    <th>SOLL</th>
                    <th>IST</th>
                    <th>Differenz</th>
                </tr>
                </thead>
                <tbody>
                {lehrerListe.map((lehrer) => (
                    <tr key={lehrer.lehrer_id}
                        onDblClick={() => handleDoubleClick(lehrer.lehrer_id)}
                        style={{cursor: 'pointer'}}
                    >
                        <td>{lehrer.vorname}</td>
                        <td>{lehrer.nachname}</td>
                        <td>{lehrer.soll_wochenstunden}</td>
                        <td>{lehrer.ist_wochenstunden}</td>
                        <td style={{ color: lehrer.ist_wochenstunden - lehrer.soll_wochenstunden < 0 ? 'red' : 'inherit' }}>
                            {lehrer.ist_wochenstunden - lehrer.soll_wochenstunden}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}
