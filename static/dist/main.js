import { getReloading, setReloading } from "./session.js";
window.addEventListener("beforeunload", () => {
    if (!getReloading()) {
        navigator.sendBeacon("/logout");
    }
});
window.addEventListener("DOMContentLoaded", async () => {
    console.log("main.js geladen");
    await checkLoginStatus();
    setupLinks();
    setupReloadSafeNavigation();
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
function applyRoleVisibility(rolle) {
    document.querySelectorAll(`[data-role]`).forEach(el => {
        const rollen = el.dataset.role?.split(" ") ?? [];
        if (rollen.includes(rolle) || rolle === "admin") {
            el.classList.remove("hidden");
        }
    });
}
async function checkLoginStatus() {
    try {
        const response = await fetch("/status", {
            credentials: "include",
        });
        if (!response.ok)
            return;
        const data = await response.json();
        const authStatus = document.getElementById("auth-status");
        if (authStatus) {
            authStatus.innerHTML = `
        <a href="#" class="start-link" id="logout-link">Logout, ${data.benutzer}</a>
      `;
            document.getElementById("logout-link")?.addEventListener("click", async (e) => {
                e.preventDefault();
                await fetch("/logout", { method: "POST" });
                setReloading(true);
                location.reload();
            });
            applyRoleVisibility(data.rolle);
        }
    }
    catch (err) {
        console.error("Fehler beim Login-Check:", err);
    }
}
function setupReloadSafeNavigation() {
    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("a[href^='/']");
        if (!link)
            return;
        if (!link.hasAttribute("data-page")) {
            setReloading(true);
        }
    });
}
