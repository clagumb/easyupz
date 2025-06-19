import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

type SchuljahrContextType = {
    schuljahr: string;
    setSchuljahr: (sj: string) => void;
};

const SchuljahrContext = createContext<SchuljahrContextType | null>(null);

export function SchuljahrProvider({ children }: { children: preact.ComponentChildren }) {
    const [schuljahr, setSchuljahr] = useState("");

    useEffect(() => {
        fetch("/schuljahre/aktiv")
            .then(res => {
                if (!res.ok) throw new Error("Aktives Schuljahr konnte nicht geladen werden");
                return res.json();
            })
            .then((data) => {
                setSchuljahr(data.anzeigeform);
                console.log(data);
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
