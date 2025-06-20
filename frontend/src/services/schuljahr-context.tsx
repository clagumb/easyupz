import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import type { Schuljahr } from "../components/types/Schuljahr.ts";

type SchuljahrContextType = {
    schuljahr: Schuljahr | null;
    setSchuljahr: (sj: Schuljahr) => void;
};

const SchuljahrContext = createContext<SchuljahrContextType | null>(null);

export function SchuljahrProvider({ children }: { children: preact.ComponentChildren }) {
    const [schuljahr, setSchuljahr] = useState<Schuljahr | null>(null);

    useEffect(() => {
        fetch("/schuljahre/aktiv")
            .then(res => {
                if (!res.ok) throw new Error("Aktives Schuljahr konnte nicht geladen werden");
                return res.json();
            })
            .then((data: Schuljahr) => {
                setSchuljahr(data);
                console.log(data)
            })
            .catch((err) => {
                console.error("Fehler beim Laden des aktiven Schuljahrs:", err);
            });
    }, []);

    return (
        <SchuljahrContext.Provider value={{ schuljahr, setSchuljahr }}>
            {children}
        </SchuljahrContext.Provider>
    );
}

export function useSchuljahr(): SchuljahrContextType {
    const ctx = useContext(SchuljahrContext);
    if (!ctx) throw new Error("useSchuljahr must be used within a SchuljahrProvider");
    return ctx;
}
