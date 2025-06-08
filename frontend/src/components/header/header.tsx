import "./header.css"
import fav_icon from "../../assets/logo.svg"

export default function Header() {
    return (
        <header style={{ gridArea: "header" }}>
            <img src={fav_icon} alt="Logo" />
            <div className="header-right">
                <label htmlFor="schuljahr">Schuljahr:</label>
                <select id="schuljahr">
                    <option>2024/2025</option>
                    <option>2025/2026</option>
                </select>
                <button>Login</button>
            </div>
        </header>
    );
}