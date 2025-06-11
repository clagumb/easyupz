import { useState } from "preact/hooks";
import type { Props } from '../../../types/PathProps.tsx';
import { useAuth } from '../../../../services/auth-context.tsx'
import type { JSX } from "preact/jsx-runtime";
import { route } from "preact-router";

import "./login.css";

const LoginForm = (_: Props) => {
  const [benutzer, setBenutzer] = useState("");
  const [passwort, setPasswort] = useState("");
  const [error, setError] = useState("");
  const [, setAuth] = useAuth();

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ benutzer, passwort }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("in login ok");
      setAuth({
        benutzer: result.benutzer,
        rolle: result.rolle,
        eingeloggt: true,
      });
      route("/");
    } else {
      setError("Login fehlgeschlagen: " + result.message);
    }
  };

  return (
    <div className={"login-wrapper"}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={benutzer}
            onInput={(e: any) => setBenutzer(e.target.value)}
            placeholder="Benutzer"
          />
        </div>
        <div className={"form-group"}>
          <input
            type="password"
            value={passwort}
            onInput={(e: any) => setPasswort(e.target.value)}
            placeholder="Passwort"
          />
        </div>
        <button type="submit" className={"login-button"}>Anmelden</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
