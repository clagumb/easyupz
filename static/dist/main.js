"use strict";
console.log("main.js geladen");
function setupLinks() {
    document.body.addEventListener("click", async (e) => {
        const link = e.target.closest("a[data-page]");
        if (!link)
            return;
        e.preventDefault();
        const page = link.dataset.page;
        if (!page)
            return;
        console.log("Lade Seite:", page);
        try {
            const response = await fetch(`/static/pages/${page}.html`);
            if (!response.ok)
                throw new Error(`Fehler beim Laden von ${page}`);
            const html = await response.text();
            const main = document.getElementById("main-content");
            if (main) {
                main.innerHTML = html;
            }
            try {
                const module = await import(`./${page}.js`);
                if (module.init)
                    module.init();
            }
            catch (e) {
                console.warn(`Kein JS-Modul für ${page}`);
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
setupLinks();
