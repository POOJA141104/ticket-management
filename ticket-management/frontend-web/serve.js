const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const BUILD_DIR = path.join(__dirname, "build");
const API_HOST = "localhost";
const API_PORT = 5000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".map":  "application/json",
  ".txt":  "text/plain",
};

const server = http.createServer((req, res) => {
  // Proxy /api and /uploads to backend
  if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
    const headers = { ...req.headers, host: `localhost:${API_PORT}` };
    const proxyReq = http.request(
      {
        hostname: API_HOST,
        port: API_PORT,
        path: req.url,
        method: req.method,
        headers: headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );

    proxyReq.on("error", (err) => {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Backend unavailable", message: err.message }));
    });

    req.pipe(proxyReq, { end: true });
    return;
  }

  // Serve static build assets
  const cleanUrl = req.url.split("?")[0];
  let filePath = path.join(BUILD_DIR, cleanUrl);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA Fallback to index.html for React Router
      const indexPath = path.join(BUILD_DIR, "index.html");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(indexPath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Web frontend running on http://localhost:${PORT}`);
});

