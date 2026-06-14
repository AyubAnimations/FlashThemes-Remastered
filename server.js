const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const HOST = '0.0.0.0';
const PROXY_HOST = 'flashthemes.net';
const LOCAL_DOMAIN = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : `http://${HOST}:${PORT}`;

// In-memory cache for proxied static assets
const staticCache = new Map();
const CACHE_MAX_SIZE = 500;
const CACHE_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

function getCached(urlPath) {
  const entry = staticCache.get(urlPath);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_MAX_AGE_MS) {
    staticCache.delete(urlPath);
    return null;
  }
  return entry;
}

function setCached(urlPath, headers, buf) {
  if (staticCache.size >= CACHE_MAX_SIZE) {
    const firstKey = staticCache.keys().next().value;
    staticCache.delete(firstKey);
  }
  staticCache.set(urlPath, { headers, buf, time: Date.now() });
}

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.swf': 'application/x-shockwave-flash',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.gz': 'application/gzip',
  '.txt': 'text/plain',
  '.swz': 'application/octet-stream',
};

const STATIC_EXTS = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.swf', '.ttf', '.woff', '.woff2', '.gz', '.txt', '.swz'];

// Map local paths to real site paths (trailing slash matches real site to avoid 301 loops)
const LOCAL_PATH_MAP = {
  '/': '/',
  '/dashboard': '/dashboard',
  '/dashboard/': '/dashboard/',
  '/movie': '/movie',
  '/movie/': '/movie/',
  '/user': '/user',
  '/user/': '/user/',
  '/shop': '/shop',
  '/shop/': '/shop/',
  '/watch': '/watch',
  '/watch/': '/watch/',
  '/create': '/create',
  '/create/': '/create/',
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
      return;
    }

    const totalSize = stats.size;
    const range = res.req && res.req.headers && res.req.headers['range'];

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = (end - start) + 1;
      const stream = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Content-Length': chunkSize,
      });
      stream.pipe(res);
      return;
    }

    const stream = fs.createReadStream(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
      'Accept-Ranges': 'bytes',
      'Content-Length': totalSize,
    });
    stream.pipe(res);
  });
}

function rewriteSetCookies(cookies) {
  if (!cookies) return [];
  const list = Array.isArray(cookies) ? cookies : [cookies];
  return list.map(cookie =>
    cookie
      .replace(/;\s*domain=[^;]*/gi, '')
      .replace(/;\s*secure/gi, '')
      .replace(/;\s*samesite=[^;]*/gi, '')
  );
}

function rewriteBody(buf, contentType) {
  const isText = contentType && (
    contentType.includes('text/html') ||
    contentType.includes('application/javascript') ||
    contentType.includes('text/css')
  );
  if (!isText) return buf;
  let str = buf.toString();
  const replaced = str
    .replace(/https:\/\/flashthemes\.net\//g, LOCAL_DOMAIN + '/')
    .replace(/https:\/\/flashthemes\.net/g, LOCAL_DOMAIN)
    .replace(/http:\/\/flashthemes\.net\//g, LOCAL_DOMAIN + '/')
    .replace(/http:\/\/flashthemes\.net/g, LOCAL_DOMAIN)
    .replace(/https%3A%2F%2Fflashthemes\.net%2F/g, encodeURIComponent(LOCAL_DOMAIN + '/'));
  if (replaced === str) return buf;
  return Buffer.from(replaced);
}

function proxyRequest(req, res, urlPath, body, shouldRewriteBody, targetHost) {
  const fullPath = urlPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');

  // Use lightspeed CDN for animation/theme assets
  const isCdnAsset = urlPath.startsWith('/static/animation/') || urlPath.startsWith('/static/ct/');
  const host = targetHost || (isCdnAsset ? 'lightspeed.flashthemes.net' : PROXY_HOST);

  // Check cache for static assets (no rewriting, no query params, no range requests)
  const isCacheable = !shouldRewriteBody && !req.url.includes('?') && !req.headers['range'] &&
    (STATIC_EXTS.includes(path.extname(urlPath).toLowerCase()) || urlPath.startsWith('/static/'));
  if (isCacheable) {
    const cached = getCached(urlPath);
    if (cached) {
      res.writeHead(200, { ...cached.headers, 'X-Cache': 'HIT' });
      res.end(cached.buf);
      return;
    }
  }

  const forwardHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': req.headers['accept'] || '*/*',
    'Accept-Language': req.headers['accept-language'] || 'en-US,en;q=0.9',
    'Referer': 'https://flashthemes.net/',
    'Origin': 'https://flashthemes.net',
    'Host': host,
  };

  if (req.headers['cookie']) {
    forwardHeaders['Cookie'] = req.headers['cookie'];
  }
  if (req.headers['range']) {
    forwardHeaders['Range'] = req.headers['range'];
  }

  if (body && body.length > 0) {
    forwardHeaders['Content-Type'] = req.headers['content-type'] || 'application/x-www-form-urlencoded';
    forwardHeaders['Content-Length'] = Buffer.byteLength(body);
  }

  const options = {
    hostname: host,
    port: 443,
    path: fullPath,
    method: req.method,
    headers: forwardHeaders,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    const ext = path.extname(urlPath.split('?')[0]).toLowerCase();
    const contentType = proxyRes.headers['content-type'] || mimeTypes[ext] || 'application/octet-stream';

    const responseHeaders = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Add cache headers for static assets (full 200 responses only)
    if (isCacheable && proxyRes.statusCode === 200 && !req.headers['range']) {
      responseHeaders['Cache-Control'] = 'public, max-age=86400';
    }

    // Forward range-request headers
    if (proxyRes.headers['accept-ranges']) {
      responseHeaders['Accept-Ranges'] = proxyRes.headers['accept-ranges'];
    }
    if (proxyRes.headers['content-range']) {
      responseHeaders['Content-Range'] = proxyRes.headers['content-range'];
    }
    if (proxyRes.headers['content-length']) {
      responseHeaders['Content-Length'] = proxyRes.headers['content-length'];
    }

    const setCookies = rewriteSetCookies(proxyRes.headers['set-cookie']);
    if (setCookies.length > 0) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    if (proxyRes.headers['location']) {
      const loc = proxyRes.headers['location'].replace(/https?:\/\/flashthemes\.net/g, '');
      responseHeaders['Location'] = loc || '/';
    }

    const status = proxyRes.statusCode;
    const isJson = contentType && contentType.includes('application/json');

    if (isJson && status === 200) {
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        let buf = Buffer.concat(chunks);
        try {
          const json = JSON.parse(buf);
          if (json.redirect) {
            json.redirect = json.redirect.replace(/https?:\/\/flashthemes\.net/g, '');
          }
          buf = Buffer.from(JSON.stringify(json));
        } catch (e) {}
        responseHeaders['Content-Length'] = buf.length;
        res.writeHead(status, responseHeaders);
        res.end(buf);
      });
    } else if (shouldRewriteBody) {
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        let buf = rewriteBody(Buffer.concat(chunks), contentType);
        responseHeaders['Content-Length'] = buf.length;
        res.writeHead(status, responseHeaders);
        res.end(buf);
      });
    } else {
      // Collect response for caching
      if (isCacheable) {
        const chunks = [];
        proxyRes.on('data', chunk => chunks.push(chunk));
        proxyRes.on('end', () => {
          const buf = Buffer.concat(chunks);
          setCached(urlPath, responseHeaders, buf);
          responseHeaders['Content-Length'] = buf.length;
          res.writeHead(status, responseHeaders);
          res.end(buf);
        });
      } else {
        res.writeHead(status, responseHeaders);
        proxyRes.pipe(res);
      }
    }
  });

  proxyReq.on('error', () => {
    res.writeHead(502);
    res.end('Proxy error');
  });

  if (body && body.length > 0) {
    proxyReq.write(body);
  }
  proxyReq.end();
}

function collectBody(req, callback) {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => callback(Buffer.concat(chunks)));
}

function tryLocalStatic(urlPath, res, fallback) {
  const localPath = path.join(__dirname, urlPath);

  if (urlPath.startsWith('/js/')) {
    const filename = urlPath.slice('/js/'.length);
    const candidates = [
      localPath,
      path.join(__dirname, 'js', 'js', filename),
      path.join(__dirname, 'js', filename),
    ];
    let checked = 0;
    const next = () => {
      if (checked >= candidates.length) {
        fallback();
        return;
      }
      const p = candidates[checked++];
      fs.stat(p, (err, stats) => {
        if (!err && stats.isFile()) {
          serveFile(p, res);
        } else {
          next();
        }
      });
    };
    next();
  } else {
    fs.stat(localPath, (err, stats) => {
      if (!err && stats.isFile()) {
        serveFile(localPath, res);
      } else {
        fallback();
      }
    });
  }
}

const server = http.createServer((req, res) => {
  collectBody(req, (body) => {
    let urlPath = req.url.split('?')[0];

    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Cookie',
        'Access-Control-Allow-Credentials': 'true',
      });
      res.end();
      return;
    }

    // Serve custom videomaker HTML
    if (urlPath === '/videomaker/custom/full' || urlPath === '/videomaker/custom/full/') {
      const customHtmlPath = path.join(__dirname, 'html', 'videomaker_custom_full.html');
      fs.readFile(customHtmlPath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Custom HTML file not found');
          return;
        }
        let html = data.toString();
        // Rewrite any absolute URLs in the custom HTML to local paths
        html = html.replace(/https:\/\/flashthemes\.net\//g, LOCAL_DOMAIN + '/');
        html = html.replace(/https:\/\/flashthemes\.net/g, LOCAL_DOMAIN);
        html = html.replace(/https:\/\/lightspeed\.flashthemes\.net\//g, LOCAL_DOMAIN + '/');
        html = html.replace(/https:\/\/lightspeed\.flashthemes\.net/g, LOCAL_DOMAIN);
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        });
        res.end(html);
      });
      return;
    }

    // Map local paths to real site paths
    let realPath = urlPath;
    if (LOCAL_PATH_MAP[urlPath]) {
      realPath = LOCAL_PATH_MAP[urlPath];
    }

    const ext = path.extname(realPath).toLowerCase();

    // For static assets, try local files first
    if (STATIC_EXTS.includes(ext) || realPath.startsWith('/static/')) {
      tryLocalStatic(realPath, res, () => {
        proxyRequest(req, res, realPath, body, false);
      });
      return;
    }

    // For HTML pages and AJAX, proxy to the real site with body rewriting
    proxyRequest(req, res, realPath, body, true);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`FlashThemes server running at ${LOCAL_DOMAIN}`);
});
