import fav_icon from "../../assets/logo.svg"
import { NavLink } from "../types/NavLink.tsx";

import "./header.css"

export default function Header() {
    return (
        <header style={{ gridArea: "header" }}>
            <NavLink href="/">
                <img src={fav_icon} alt="Logo" />
            </NavLink>
            <div className="header-right">
                <label htmlFor="schuljahr">Schuljahr:</label>
                <select id="schuljahr">
                    <option>2024/2025</option>
                    <option>2025/2026</option>
                </select>
                <NavLink href="/login"><button>Login</button></NavLink>
            </div>
        </header>
    );
}