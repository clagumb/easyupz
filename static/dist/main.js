"use strict";
window.addEventListener("DOMContentLoaded", async () => {
    console.log("main.js geladen");
    await checkLoginStatus(); // warte auf Session-Check
    console.log("nach checkLogin");
    setupLinks(); // danach: Navigation & Inhalte laden
});
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
async function checkLoginStatus() {
    try {
        const response = await fetch("/status", {
            credentials: "include",
        });
        if (!response.ok) {
            console.log("in nicht okay");
            return;
        }
        const data = await response.json();
        const authStatus = document.getElementById("auth-status");
        if (authStatus) {
            authStatus.innerHTML = `
        <a href="#" class="start-link" id="logout-link">Logout, ${data.benutzer}</a>
      `;
            document
                .getElementById("logout-link")
                ?.addEventListener("click", async (e) => {
                e.preventDefault();
                await fetch("/logout", { method: "POST" });
                location.reload();
            });
        }
    }
    catch (err) {
        console.error("Fehler beim Login-Check:", err);
    }
}
