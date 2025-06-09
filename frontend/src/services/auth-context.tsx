import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";

type Auth = {
  benutzer: string;
  rolle: string;
  eingeloggt: boolean;
};

const AuthContext = createContext<[Auth, (auth: Auth) => void]>([
  { benutzer: "", rolle: "", eingeloggt: false },
  () => {},
]);

export default function AuthProvider({ children }: {children: ComponentChildren}) {
  const [auth, setAuth] = useState<Auth>({
    benutzer: "",
    rolle: "",
    eingeloggt: false,
  });

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
