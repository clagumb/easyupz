import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";

type Auth = {
  benutzer: string;
  rolle: string;
  eingeloggt: boolean;
};

const defaultAuth: Auth = {
  benutzer: "",
  rolle: "",
  eingeloggt: false,
};

const AuthContext = createContext<[Auth, (auth: Auth) => void]>([
  defaultAuth,
  () => { },
]);

export default function AuthProvider({ children }: { children: ComponentChildren }) {
  const [auth, setAuth] = useState<Auth>(defaultAuth);

  useEffect(() => {
    fetch("/status", { credentials: "include" })
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data: { benutzer: string; rolle: string }) => {
        setAuth({
          benutzer: data.benutzer,
          rolle: data.rolle,
          eingeloggt: true,
        });
      })
      .catch(() => {
        setAuth(defaultAuth);
      });
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
