import "./aside.css";

export default function Aside() {
    return (
        <aside style={{ gridArea: "sidebar" }}>
            <p>Unterrichtspflichtszeit</p>
            <a href="#">Gesamtansicht</a><br />
            <a href="#">Einzelbetrachtung</a><br />
            <a href="#">Anrechnungen</a><br />
            <a href="#">Ermäßigungen</a><br />

            <p>Administration</p>
            <a href="#">Lehrkräfte</a><br />
            <a href="#">Schuljahre</a><br />
            <a href="#">Anrechnungen</a><br />
            <a href="#">Ermäßigungen</a><br />
            <a href="#">Schulen</a><br />
            <a href="#">Benutzerverwaltung</a>
        </aside>
    );
}