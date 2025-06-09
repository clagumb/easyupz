import { NavLink } from "../types/NavLink.tsx";
import { useAuth } from '../../services/auth-context.tsx'
import "./aside.css";

export default function Aside() {
    const [auth] = useAuth();

    switch (auth.rolle) {
        case "admin":
            return (
                <aside style={{ gridArea: "sidebar" }}>
                    Unterrichtspflichtszeit<br />
                    <NavLink href="/gesamtansicht">Gesamtansicht</NavLink>
                </aside>
            );

        default:
            return (
                <aside style={{ gridArea: "sidebar" }}>
                    Unterrichtspflichtszeit<br />
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