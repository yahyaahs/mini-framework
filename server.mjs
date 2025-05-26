import { createServer } from 'http';
import { readdirSync, readFile, readFileSync, existsSync, lstatSync } from 'fs';
import path from 'path';

const routes = readdirSync('src')
    .filter(f => f.endsWith('.mjs'))
    .reduce((map, file) => {
        const route = file === 'index.mjs' ? '/' : '/' + file.replace('.mjs', '');
        map[route] = path.join('src', file);
        return map;
    }, {});

Object.entries(routes).forEach(([url, file]) => { console.log(`\t${file} → ${url}`) });

const server = createServer(async (req, res) => {
    if (req.url.startsWith('/api')) {
        const route = req.url.replace('/api', '') || '/';
        const page = routes[route];

        if (page) {
            try {
                const webPath = '/' + path.relative('.', page);

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(webPath);
            } catch (err) {
                console.error(err);
                res.writeHead(500).end('Failed to load page');
            }
        } else {
            res.writeHead(404).end('Page Not Found');
        }
        return;
    }

    const filePath = path.join('.', req.url);
    if (existsSync(filePath) && lstatSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const contentType = {
            '.js': 'application/javascript',
            '.mjs': 'application/javascript',
            '.css': 'text/css',
            '.html': 'text/html',
        }[ext] || 'text/plain';

        const content = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        return res.end(content);
    }

    // Serve static index.html for all paths
    readFile(path.join('index.html'), (err, content) => {
        if (err) return res.writeHead(500).end('Error loading index');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
    });
});

server.listen(3000, () => {
    console.log('\nmini-framework running on http://localhost:3000');
});