import fav_icon from "../../assets/logo.svg";
import { NavLink } from "../types/NavLink.tsx";
import { useAuth } from "../../services/auth-context.tsx";
import { route } from "preact-router";
import "./header.css";

export default function Header() {
  const [auth, setAuth] = useAuth();

  const handleLogout = async () => {
    await fetch("/logout", { method: "POST", credentials: "include" });
    setAuth({ benutzer: "", rolle: "", eingeloggt: false });
    route("/");
  };

  return (
    <header style={{ gridArea: "header" }}>
      <NavLink href="/">
        <img src={fav_icon} alt="Logo" class="logo" />
      </NavLink>
      <div className="header-right">
        <label htmlFor="schuljahr">Schuljahr:</label>
        <select id="schuljahr">
          <option>2024/2025</option>
          <option>2025/2026</option>
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
}
