const http = require('http');
const fs = require('fs');
const path = require('path');

const routes = fs.readdirSync('src')
    .filter(f => f.endsWith('.js'))
    .reduce((map, file) => {
        const route = file === 'index.js' ? '/' : '/' + file.replace('.js', '');
        map[route] = path.join('src', file);
        return map;
    }, {});

Object.entries(routes).forEach(([url, file]) => { console.log(`\t${file} → ${url}`) });

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api')) {
        const route = req.url.replace('/api', '') || '/';
        const page = routes[route];

        if (page) {
            delete require.cache[require.resolve(page)];
            const { default: render } = require(page);
            const html = render();
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } else {
            res.writeHead(404).end('Page Not Found');
        }
        return;
    }

    // Serve static index.html for all paths
    fs.readFile(path.join('src/index.html'), (err, content) => {
        if (err) return res.writeHead(500).end('Error loading index');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
    });
});

server.listen(3000, () => {
    console.log('\nmini-framework running on http://localhost:3000');
});