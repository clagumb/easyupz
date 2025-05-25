const isLoggedIn: boolean = true; // oder false
const username: string = "c.gumbmann";

const userInfo = document.getElementById("user-info");

if (userInfo) {
  if (isLoggedIn) {
    userInfo.innerHTML = `
      <span style="margin-right: 1rem;">${username}</span>
      <button id="logout-button">abmelden</button>
    `;

    const logoutButton = document.getElementById(
      "logout-button",
    ) as HTMLButtonElement;
    logoutButton.addEventListener("click", logout);
  } else {
    userInfo.innerHTML = `<a href="/login" class="start-link">Login</a>`;
  }
}

function logout(): void {
  // z. B. Token löschen, Session zurücksetzen, weiterleiten
  alert("Sie wurden abgemeldet.");
  // window.location.href = "/login";
}
