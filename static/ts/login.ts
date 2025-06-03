export function init() {
  const form = document.querySelector("form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const benutzer = (document.getElementById("benutzer") as HTMLInputElement)
      .value;
    const passwort = (document.getElementById("passwort") as HTMLInputElement)
      .value;

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ benutzer, passwort }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("in login ok");
      location.reload();
    } else {
      alert("Login fehlgeschlagen: " + result.message);
    }
  });
}
