// ShopEasy Lite: a tiny web application with no external dependencies.
// All settings come from environment variables, so the same code can run
// unchanged in development, in a container, or on a server.

const http = require("node:http");
const { cartTotal } = require("./src/cart");

const PORT = Number(process.env.PORT) || 3000;
const APP_ENV = process.env.APP_ENV || "development";
const APP_VERSION = process.env.APP_VERSION || "dev";
const APP_COLOR = process.env.APP_COLOR || "steelblue";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function homePage() {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title> Version from conflict-demo ShopEasy Lite 222222</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center;
         background: ${escapeHtml(APP_COLOR)}; color: #fff; }
  main { text-align: center; padding: 2rem; }
  h1 { font-size: 2.5rem; margin: 0 0 1rem; }
  code { background: rgba(0,0,0,.25); padding: .2rem .5rem; border-radius: 4px; }
</style></head>
<body><main>
  <h1>ShopEasy Lite</h1>
  <p>Environment: <code>${escapeHtml(APP_ENV)}</code></p>
  <p>Version: <code>${escapeHtml(APP_VERSION)}</code></p>
  <p>Try <code>/health</code> or <code>/api/total?amount=1000&amp;discount=10</code></p>
</main></body>
</html>`;
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(homePage());
  }

  if (url.pathname === "/health") {
    return sendJson(res, 200, {
      status: "ok",
      environment: APP_ENV,
      version: APP_VERSION,
      uptimeSeconds: Math.round(process.uptime()),
    });
  }

  if (url.pathname === "/api/total") {
    const amount = Number(url.searchParams.get("amount"));
    const discount = Number(url.searchParams.get("discount") || 0);
    try {
      return sendJson(res, 200, { amount, discountPercent: discount, total: cartTotal(amount, discount) });
    } catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
  }

  sendJson(res, 404, { error: "not found" });
});

server.listen(PORT, () => {
  console.log(`ShopEasy Lite (${APP_ENV}, version ${APP_VERSION}) listening on port ${PORT}`);
});

// Stop cleanly when Docker or a process manager asks the app to stop.
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down");
  server.close(() => process.exit(0));
});
