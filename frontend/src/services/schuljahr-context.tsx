import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import { berechneSchuljahr} from "./berechneSchuljahr.ts";

type SchuljahrContextType = {
    schuljahr: string;
    setSchuljahr: (sj: string) => void;
};

const SchuljahrContext = createContext<SchuljahrContextType | null>(null);

export function SchuljahrProvider({ children }: { children: preact.ComponentChildren }) {
    const [schuljahr, setSchuljahr] = useState(berechneSchuljahr());

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
