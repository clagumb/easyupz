"use strict";
function setupLinks() {
    const links = document.querySelectorAll('.aside-link');
    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (!page)
                return;
            try {
                const response = await fetch(`pages/${page}.html`);
                if (!response.ok)
                    throw new Error(`Seite ${page} konnte nicht geladen werden.`);
                const html = await response.text();
                const main = document.getElementById('main-content');
                if (main)
                    main.innerHTML = html;
                // ⬇️ Nach dem Einfügen: das passende JS-Modul dynamisch importieren
                const module = await import(`./${page}.js`);
                if (module.init)
                    module.init();
            }
            catch (err) {
                console.error(err);
            }
        });
    });
}
setupLinks();
