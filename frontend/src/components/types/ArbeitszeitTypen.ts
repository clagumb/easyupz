export type WochenfaktorDTO = {
    wochenfaktor_id: number;
    bezeichnung: string;
    beginn: string;
    ende: string;
    schultage: number;
};

export type SchuljahrDTO = {
    schuljahr_id: number;
    anzeigeform: string;
    aktiv: boolean;
    schultage: number;
    wochenfaktoren: WochenfaktorDTO[];
};