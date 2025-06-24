import {NavLink} from "../types/NavLink.tsx";
import {useAuth} from '../../services/auth-context.tsx'
import "./aside.css";

export default function Aside() {
    const [auth,] = useAuth();

    switch (auth.rolle) {
        case "admin":
            return (
                <aside style={{gridArea: "sidebar"}}>
                    <p>Unterrichtspflichtzeit</p>
                    <NavLink href="/gesamtansicht" className={"button-link"}>Gesamtansicht</NavLink>
                    <p className={"big-spacer"}>Administration</p>
                    <NavLink href="/lehrerverwaltung" className={"button-link"}>Lehrerverwaltung</NavLink>
                    <NavLink href="/benutzer" className={"button-link"}>Benutzerverwaltung</NavLink>
                </aside>
            );

        case "schulleitung":
            return (
                <aside style={{gridArea: "sidebar"}}>
                    <p>Unterrichtspflichtzeit</p>
                    Für angemeldete Mitglieder der Schulleitung
                </aside>
            );

        case "lehrkraft":
            return (
                <aside style={{gridArea: "sidebar"}}>
                    <p>Unterrichtspflichtzeit</p>
                    Für angemeldete Lehrkräfte
                </aside>
            );

        default:
            return (
                <aside style={{gridArea: "sidebar"}}>
                    Unterrichtspflichtzeit<br/>
                </aside>
            );
    }
}

/*
 <Link href="">Einzelbetrachtung</Link><br />
            <Link href="">Anrechnungen</Link><br />
            <Link href="">Ermäßigungen</Link><br />

            <p>Administration</p>
            <Link href="">Lehrkräfte</Link><br />
            <Link href=">Schuljahre</Link><br />
            <Link href="">Anrechnungen</Link><br />
            <Link href="">Ermäßigungen</Link><br />
            <Link href="">Schulen</Link><br />
            <Link href="">Benutzerverwaltung</Link>
        </aside >
*/