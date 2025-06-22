import "./header.css";
import {useEffect, useState} from "preact/hooks";
import fav_icon from "../../assets/logo.svg";
import {NavLink} from "../types/NavLink.tsx";
import {useAuth} from "../../services/auth-context.tsx";
import {useSchuljahr} from "../../services/schuljahr-context.tsx";
import {route} from "preact-router";
import type {Schuljahr} from "../types/Schuljahr.ts";

export default function Header() {
    const [auth, setAuth] = useAuth();
    const {schuljahr, setSchuljahr} = useSchuljahr();
    const [alleSchuljahre, setAlleSchuljahre] = useState<Schuljahr[]>([]);

    const handleLogout = async () => {
        await fetch("/logout", {method: "POST", credentials: "include"});
        setAuth({benutzer: "", rolle: "", eingeloggt: false});
        route("/");
    };

    useEffect(() => {
        fetch("/schuljahre")
            .then((res) => res.json())
            .then((data) => {
                setAlleSchuljahre(data);
                if (!schuljahr && data.length > 0) {
                    const aktiv = data.find((sj: Schuljahr) => sj.anzeigeform === schuljahr) || data[0];
                    setSchuljahr(aktiv);
                }
            })
            .catch((err) => console.error("Fehler beim Laden der Schuljahre:", err));
    }, []);

    switch (auth.rolle) {
        case "admin":
        case "schulleitung":
        case "lehrkraft":
            return (
                <header style={{gridArea: "header"}}>
                    <NavLink href="/">
                        <img src={fav_icon} alt="Logo" className={"logo"}/>
                    </NavLink>
                    <div className={"header-right"}>
                        <label htmlFor="schuljahr">Schuljahr:</label>
                        <select
                            id="schuljahr"
                            value={schuljahr?.anzeigeform ?? ""}
                            onChange={(e) => {
                                const ausgewaehlt = alleSchuljahre.find(
                                    (sj) => sj.anzeigeform === e.currentTarget.value
                                );
                                if (ausgewaehlt) setSchuljahr(ausgewaehlt);
                                console.log(ausgewaehlt);
                            }}
                        >
                            {alleSchuljahre.map((sj) => (
                                <option key={sj.schuljahr_id} value={sj.anzeigeform}>
                                    {sj.anzeigeform}
                                </option>
                            ))}
                        </select>

                        {auth.eingeloggt ? (
                            <>
                                <span>{auth.benutzer}</span>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <NavLink href="/login">
                                <button>Login</button>
                            </NavLink>
                        )}
                    </div>
                </header>
            );
        default:
            return (
                <header style={{gridArea: "header"}}>
                    <NavLink href="/">
                        <img src={fav_icon} alt="Logo" className={"logo"}/>
                    </NavLink>
                    <NavLink href="/login">
                        <button>Login</button>
                    </NavLink>
                </header>
            );
    }
}
