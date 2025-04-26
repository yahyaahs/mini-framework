import { __V_Dom } from "./virtual_dom.mjs";

const loadPage = async (path) => {
    const res = await fetch(`/api${path}`);
    const data = await res.text();

    const { default: compoGenerator } = await import(`${data}`);
    
    const prevData = {prev_data:'test from server'}
    const serverApp = compoGenerator(prevData);

    const container = document.getElementById('app')
    if (serverApp !== null) {
        container.innerHTML = serverApp.renderToString();
        serverApp.hydrate(container);
    }
}

const navigate = async (e) => {
    e.preventDefault();
    const path = e.target.getAttribute('href');
    history.pushState({}, '', path);
    await loadPage(path);
    document.querySelectorAll('a[data-link]').forEach(link =>
        link.addEventListener('click', navigate)
    );
}

document.addEventListener('DOMContentLoaded', async () => {
    window.addEventListener('popstate', () => loadPage(location.pathname));
    await loadPage(location.pathname);
    document.querySelectorAll('a[data-link]').forEach(link =>
        link.addEventListener('click', navigate)
    );
});