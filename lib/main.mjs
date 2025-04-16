import { parseHTML, render } from "./dom.mjs";

const loadPage = async (path) => {
    const res = await fetch(`/api${path}`);
    const contentType = res.headers.get('Content-Type') || '';

    let data;
    if (contentType.includes('application/json')) {
        data = await res.json();
    } else {
        data = parseHTML(await res.text());
    }

    // made the rerendring
    render(document.getElementById('app'), data);
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