function setupLinks() {
  const links = document.querySelectorAll<HTMLAnchorElement>('.aside-link');

  links.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();

      const page = link.dataset.page;
      if (!page) return;

      try {
        const response = await fetch(`static/pages/${page}.html`);
        if (!response.ok) throw new Error(`Seite ${page} konnte nicht geladen werden.`);

        const html = await response.text();
        const main = document.getElementById('main-content');
        if (main) {
          main.innerHTML = html;
          setupLinks(); // reinitialisieren, falls neue Links geladen wurden
        }

        // Nachladen des passenden JS-Moduls
        try {
          const module = await import(`./${page}.js`);
          if (module.init) module.init();
        } catch (e) {
          console.warn(`Kein passendes JS-Modul für ${page} gefunden.`);
        }

      } catch (err) {
        console.error(err);
      }
    });
  });
}

setupLinks();
