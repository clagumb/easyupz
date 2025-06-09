import { useEffect, useState } from 'preact/hooks';
import type { Props } from '../../../types/PathProps.tsx';
import './gesamtansicht.css';

type Lehrer = {
  id: number;
  vorname: string;
  nachname: string;
};

export default function Gesamtansicht(_: Props) {
  const [lehrerListe, setLehrerListe] = useState<Lehrer[]>([]);

  useEffect(() => {
    fetch('/lehrer')
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data: Lehrer[]) => setLehrerListe(data))
      .catch((err) => console.error('Fehler beim Laden der Lehrerliste:', err));
  }, []);

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
            <tr key={lehrer.id}>
              <td>{lehrer.vorname}</td>
              <td>{lehrer.nachname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
