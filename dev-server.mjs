// 로컬 개발용 정적 서버.
// GitHub Pages(404.html fallback)와 같은 방식으로 동작한다: 실제 파일이 있으면 그대로 주고, 없으면 index.html 로 넘겨
// 클라이언트 라우터가 경로를 처리하게 한다(SPA fallback).
//
//   node dev-server.mjs           → http://localhost:8001
//   PORT=3000 node dev-server.mjs
//
// 외부 의존성 없음.

import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 8001;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'text/javascript; charset=utf-8',
    '.mjs':  'text/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg':  'image/svg+xml',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.ico':  'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2':'font/woff2',
    '.psd':  'application/octet-stream',
};

// 프로젝트 밖으로 벗어나는 경로 요청을 막는다.
function safePath(pathname) {
    const decoded = decodeURIComponent(pathname.split('?')[0]);
    const target = normalize(join(ROOT, decoded));

    return target.startsWith(ROOT) ? target : null;
}

async function resolveFile(target) {
    try {
        const info = await stat(target);
        if (info.isDirectory()) return resolveFile(join(target, 'index.html'));

        return info.isFile() ? target : null;
    } catch {
        return null;
    }
}

async function send(res, file, status = 200) {
    const body = await readFile(file);

    res.writeHead(status, {
        'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
        'Content-Length': body.length,
        'Cache-Control': 'no-store',
    });
    res.end(body);
}

const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const target = safePath(url.pathname);

    if (!target) {
        res.writeHead(400).end('Bad Request');

        return;
    }

    try {
        const file = await resolveFile(target);
        if (file) {
            await send(res, file);

            return;
        }

        // 실제 파일이 없으면 SPA 셸을 돌려준다.
        await send(res, join(ROOT, 'index.html'), 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500).end('Internal Server Error');
    }
});

server.listen(PORT, () => {
    console.log(`홍앤전 신경과신경외과 — http://localhost:${PORT}`);
    console.log(`(정적 루트: ${ROOT.replace(new RegExp(sep + '$'), '')})`);
});
