// Prerender public routes to static HTML after `vite build`, so search engines and link previews
// see real content and per-page meta tags even though the site is a client-rendered React app.
//
//   npm i -D playwright && npx playwright install chromium
//   npm run build:prerender
//
// Optional: PRERENDER_API_URL=https://your-api.example.com so /work shows your real published projects
// in the static HTML. Without it the placeholder projects are baked in; the live app still loads the real ones.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const ROUTES = [
  '/', '/services/portfolios', '/services/task-management', '/services/ecommerce', '/services/data-pipelines',
  '/work', '/pricing', '/about', '/contact', '/privacy', '/terms',
];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml' };

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Prerender needs Playwright: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

// Tiny static server with SPA fallback (always serves the original shell, never a prerendered copy).
const shell = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const file = path.join(dist, path.normalize(url.pathname));
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
  try {
    const stat = await fs.stat(file);
    if (stat.isFile()) {
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(await fs.readFile(file));
      return;
    }
  } catch { /* fall through to the shell */ }
  res.writeHead(200, { 'content-type': 'text/html' }).end(shell);
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

let projectsJson = null;
if (process.env.PRERENDER_API_URL) {
  try {
    const r = await fetch(process.env.PRERENDER_API_URL.replace(/\/$/, '') + '/api/projects');
    if (r.ok) projectsJson = await r.text();
  } catch (err) {
    console.warn('Could not fetch projects for prerender, using placeholders:', err.message);
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
await ctx.route('**/api/**', (route) => {
  if (projectsJson && route.request().url().endsWith('/api/projects')) {
    return route.fulfill({ status: 200, contentType: 'application/json', body: projectsJson });
  }
  return route.abort();
});

for (const route of ROUTES) {
  const page = await ctx.newPage();
  await page.goto(origin + route, { waitUntil: 'networkidle' });
  await page.waitForSelector('#main h1');
  await page.waitForTimeout(150); // let react-helmet flush head tags
  const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));
  const outDir = route === '/' ? dist : path.join(dist, route);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'index.html'), html);
  console.log('prerendered', route);
  await page.close();
}

await browser.close();
server.close();
