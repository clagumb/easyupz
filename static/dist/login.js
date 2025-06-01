export function init() {
    console.log("login init");
    // DOM-Event verknüpfen
    const form = document.querySelector("form");
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const benutzer = document.getElementById("benutzer")
            .value;
        const passwort = document.getElementById("passwort")
            .value;
        await login(benutzer, passwort);
    });
    async function login(benutzer, passwort) {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ benutzer, passwort }),
        });
        const result = await response.json();
        if (response.ok) {
            console.log("Login erfolgreich:", result);
            const authStatus = document.getElementById("auth-status");
            if (authStatus) {
                authStatus.innerHTML = `
          <a href="#" class="start-link" id="logout-link">Logout, ${result.benutzer}</a>
        `;
                document
                    .getElementById("logout-link")
                    ?.addEventListener("click", (e) => {
                    e.preventDefault();
                    // Logout-Logik hier
                    authStatus.innerHTML = `<a href="#" class="start-link" data-page="login">Login</a>`;
                });
            }
        }
        else {
            console.error("Login fehlgeschlagen:", result.message);
            alert("Login fehlgeschlagen: " + result.message);
        }
    }
}
