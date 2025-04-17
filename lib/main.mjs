import { __V_Dom } from "./virtual_dom.mjs";

const loadPage = async (path) => {
    const res = await fetch(`/api${path}`);
    const data = await res.json();
    console.log(data)

    const container = document.getElementById('app')
    container.innerHTML = data.html;

    const app = new __V_Dom();
    app.hydrate(container, data.data);
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