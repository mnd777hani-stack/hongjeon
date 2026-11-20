import { routes, notFound, matchPost } from './routes.js';
import { initModal, closeModal } from './modal.js';

const app = () => document.getElementById('app');

const viewCache = new Map();   // view 이름 → HTML 조각
let current = null;            // 현재 라우트
let currentModule = null;      // 현재 페이지 모듈 (unmount 호출용)

/* ------------------------------------------------------------------ 경로 */

// '/intro/', '/post_list/4.html' 처럼 들어와도 같은 라우트로 취급한다.
function normalize(pathname) {
    let p = decodeURIComponent(pathname);
    p = p.replace(/\.html$/, '');
    p = p.replace(/\/+$/, '');

    return p === '' ? '/' : p;
}

function resolve(pathname) {
    const path = normalize(pathname);

    return routes.find((r) => r.path === path) || matchPost(path) || { ...notFound, path };
}

/* -------------------------------------------------------------------- 뷰 */

export async function loadView(view) {
    if (viewCache.has(view)) return viewCache.get(view);

    const res = await fetch(`/pages/${view}.html`, { headers: { Accept: 'text/html' } });
    if (!res.ok) throw new Error(`${view}: ${res.status}`);

    const html = await res.text();
    // SPA fallback 때문에 조각 대신 셸이 돌아온 경우(조각 파일 누락)를 걸러낸다.
    if (/<!DOCTYPE|<html[\s>]/i.test(html)) throw new Error(`${view}: 조각이 아니라 문서가 반환됨`);

    viewCache.set(view, html);

    return html;
}

function setMeta(route) {
    document.title = route.title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', route.description || '');
}

function unmountCurrent() {
    if (currentModule && typeof currentModule.unmount === 'function') {
        try {
            currentModule.unmount();
        } catch (err) {
            console.error(err);
        }
    }
    currentModule = null;
}

async function render(route, url) {
    let html;
    try {
        html = await loadView(route.view);
    } catch (err) {
        console.error('페이지를 불러오지 못했습니다.', err);
        if (route.view === notFound.view) return;

        return render({ ...notFound, path: route.path }, url);
    }

    unmountCurrent();
    closeModal();

    app().innerHTML = html;
    setMeta(route);
    current = route;

    if (route.module) {
        try {
            const mod = await import(`/js/views/${route.module}.js`);
            currentModule = mod;
            if (typeof mod.mount === 'function') mod.mount(url);
        } catch (err) {
            console.error(`${route.module} 모듈 실행 실패`, err);
        }
    }
}

/* ---------------------------------------------------------------- 네비게이션 */

export async function navigate(href, { replace = false, scroll = true } = {}) {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) {
        location.href = url.href;

        return;
    }

    const route = resolve(url.pathname);

    if (replace) history.replaceState({}, '', url);
    else history.pushState({}, '', url);

    // 같은 뷰에서 쿼리만 달라진 경우(예: /info?sec=03)는 모듈만 다시 실행한다.
    if (current && current.view === route.view) {
        setMeta(route);
        current = route;

        if (currentModule && typeof currentModule.mount === 'function') {
            if (typeof currentModule.unmount === 'function') currentModule.unmount();
            currentModule.mount(url);
        }
    } else {
        await render(route, url);
    }

    if (scroll) window.scrollTo(0, 0);
}

function isPlainLeftClick(e) {
    return !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

// 라우터가 처리할 내부 링크인지 판단한다.
function routableUrl(a) {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return null;
    if (a.target === '_blank' || a.hasAttribute('download') || a.dataset.noRouter !== undefined) return null;

    const url = new URL(href, location.href);

    return url.origin === location.origin ? url : null;
}

function onClick(e) {
    const a = e.target.closest('a');
    if (!a || !isPlainLeftClick(e)) return;

    const url = routableUrl(a);
    if (!url) return;

    e.preventDefault();

    // 같은 주소를 다시 눌렀을 때도 맨 위로는 올려 준다.
    if (url.href === location.href) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        return;
    }

    navigate(url.href);
}

// 마우스를 올린 링크의 조각을 미리 받아 전환을 매끄럽게 한다.
function onPointerOver(e) {
    const a = e.target.closest('a');
    if (!a) return;

    const url = routableUrl(a);
    if (!url) return;

    const route = resolve(url.pathname);
    if (!viewCache.has(route.view)) loadView(route.view).catch(() => {});
}

export function start() {
    initModal();

    document.addEventListener('click', onClick);
    document.addEventListener('pointerover', onPointerOver);
    window.addEventListener('popstate', () => {
        const url = new URL(location.href);
        render(resolve(url.pathname), url);
    });

    const url = new URL(location.href);

    return render(resolve(url.pathname), url);
}
