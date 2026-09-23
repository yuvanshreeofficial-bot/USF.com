const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.svg']);

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  // Sanitize path
  const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Caching policy:
    // HTML, CSS, JS: no-cache so code updates appear immediately
    // Images & fonts: cache for 1 day
    let cacheControl = 'no-cache, must-revalidate';
    if (['.jpg', '.jpeg', '.png', '.svg', '.ico', '.woff', '.woff2', '.ttf'].includes(ext)) {
      cacheControl = 'public, max-age=86400, stale-while-revalidate=604800';
    }

    const acceptEncoding = req.headers['accept-encoding'] || '';
    const shouldGzip = COMPRESSIBLE.has(ext) && acceptEncoding.includes('gzip');

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      const headers = {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
      };

      if (shouldGzip) {
        zlib.gzip(data, (gzipErr, compressed) => {
          if (!gzipErr && compressed) {
            headers['Content-Encoding'] = 'gzip';
            headers['Content-Length'] = compressed.length;
            res.writeHead(200, headers);
            if (req.method === 'HEAD') {
              res.end();
            } else {
              res.end(compressed);
            }
          } else {
            headers['Content-Length'] = data.length;
            res.writeHead(200, headers);
            if (req.method === 'HEAD') {
              res.end();
            } else {
              res.end(data);
            }
          }
        });
      } else {
        headers['Content-Length'] = data.length;
        res.writeHead(200, headers);
        if (req.method === 'HEAD') {
          res.end();
        } else {
          res.end(data);
        }
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`USF Website server active at http://localhost:${PORT}`);
  console.log(`USF Website network access at http://192.168.1.7:${PORT}`);
});
