export function berechneSchuljahr(datum: Date = new Date()): string {
    const jahr = datum.getFullYear();
    const monat = datum.getMonth() + 1; // Januar = 0

    if (monat >= 8) {
        // Ab August beginnt neues Schuljahr
        return `${jahr}/${jahr + 1}`;
    } else {
        // Vor August noch im alten Schuljahr
        return `${jahr - 1}/${jahr}`;
    }
}