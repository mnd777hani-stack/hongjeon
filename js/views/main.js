// 메인 — 갤러리 슬라이드(한 방향 자동 진행 + 드래그), 비급여 안내 모달

import { openModal } from '../modal.js';
import { PRICES, renderPriceTable } from '../data/prices.js';

const INTERVAL = 2000;   // 자동 전환 간격
const DURATION = 450;    // 슬라이드가 미끄러지는 시간
const DRAG_RATIO = 0.15; // 뷰포트의 이 비율만큼 끌면 다음/이전 장으로 넘긴다
const DRAG_MIN = 40;     // 최소 드래그 거리(px)

let timer = null;
let cleanups = [];

/* ------------------------------------------------------------ 갤러리 슬라이드 */

function initSlider() {
    const root = document.querySelector('[data-slider]');
    if (!root) return;

    const viewport = root.querySelector('[data-viewport]') || root.firstElementChild;
    const track = root.querySelector('[data-slides]');
    const dotsBox = root.querySelector('[data-dots]');
    if (!track || !viewport) return;

    const slides = [...track.children];
    const count = slides.length;
    if (count < 2) return;

    // 마지막에서 처음으로 되돌아갈 때도 같은 방향으로 흐르도록 첫 장을 복제해 둔다.
    // index 는 0 ~ count 이며 count 는 복제본(= 0번과 같은 그림)이다.
    track.appendChild(slides[0].cloneNode(true));

    let index = 0;

    /* ------------------------------------------------------------- 위치 이동 */

    function moveTo(i, animate = true) {
        track.style.transitionDuration = animate ? `${DURATION}ms` : '0ms';
        track.style.transform = `translateX(-${i * 100}%)`;
    }

    // 복제본까지 흘렀으면 애니메이션 없이 원본 첫 장으로 되돌린다.
    function settle() {
        if (index !== count) return;
        index = 0;
        moveTo(0, false);
    }
    track.addEventListener('transitionend', settle);
    cleanups.push(() => track.removeEventListener('transitionend', settle));

    function next() {
        index += 1;
        moveTo(index);
        paintDots();
    }

    function prev() {
        // 첫 장에서 뒤로 갈 때는 복제본 자리로 순간 이동한 뒤 왼쪽에서 끌어온다.
        if (index === 0) {
            index = count;
            moveTo(index, false);
            void track.offsetWidth; // 리플로우를 강제해야 다음 이동이 애니메이션된다
        }

        index -= 1;
        moveTo(index);
        paintDots();
    }

    /* ------------------------------------------------------------------ 인디케이터 */

    const dots = [];
    if (dotsBox) {
        dotsBox.innerHTML = '';
        slides.forEach(() => {
            const dot = document.createElement('span');
            dotsBox.appendChild(dot);
            dots.push(dot);
        });
    }

    function paintDots() {
        const active = index % count;
        dots.forEach((dot, i) => {
            dot.style.width = i === active ? '20px' : '6px';
            dot.className =
                'h-1.5 rounded-full transition-all duration-300 ' +
                (i === active ? 'bg-slateink' : 'bg-slate-300');
        });
    }

    /* ------------------------------------------------------------------ 자동 재생 */

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function play() {
        if (reduced || timer) return;
        timer = setInterval(next, INTERVAL);
    }
    function pause() {
        clearInterval(timer);
        timer = null;
    }

    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', play);
    cleanups.push(() => {
        root.removeEventListener('mouseenter', pause);
        root.removeEventListener('mouseleave', play);
    });

    /* --------------------------------------------------------------- 드래그 이동 */

    let dragging = false;
    let startX = 0;
    let dx = 0;

    function onPointerDown(e) {
        // 마우스는 왼쪽 버튼만. 터치·펜은 그대로 받는다.
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        dragging = true;
        startX = e.clientX;
        dx = 0;

        pause();
        viewport.setPointerCapture(e.pointerId);
        track.style.transitionDuration = '0ms';
    }

    function onPointerMove(e) {
        if (!dragging) return;

        dx = e.clientX - startX;
        track.style.transform = `translateX(calc(-${index * 100}% + ${dx}px))`;
    }

    function onPointerUp(e) {
        if (!dragging) return;
        dragging = false;

        if (viewport.hasPointerCapture?.(e.pointerId)) viewport.releasePointerCapture(e.pointerId);

        const threshold = Math.max(DRAG_MIN, viewport.clientWidth * DRAG_RATIO);

        if (dx <= -threshold) next();
        else if (dx >= threshold) prev();
        else moveTo(index); // 부족하면 제자리로 되돌린다

        dx = 0;
        play();
    }

    // 이미지의 기본 드래그(고스트 이미지)가 끼어들지 않도록 막는다.
    function onDragStart(e) {
        e.preventDefault();
    }

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
    viewport.addEventListener('dragstart', onDragStart);
    cleanups.push(() => {
        viewport.removeEventListener('pointerdown', onPointerDown);
        viewport.removeEventListener('pointermove', onPointerMove);
        viewport.removeEventListener('pointerup', onPointerUp);
        viewport.removeEventListener('pointercancel', onPointerUp);
        viewport.removeEventListener('dragstart', onDragStart);
    });

    /* ------------------------------------------------------------------- 시작 */

    moveTo(0, false);
    paintDots();
    play();
}

/* ------------------------------------------------------------- 비급여 안내 모달 */

function initPriceButtons() {
    document.querySelectorAll('[data-price]').forEach((btn) => {
        const key = btn.dataset.price;
        if (!PRICES[key]) return;

        const onClick = (e) => {
            e.preventDefault();
            openModal({ title: PRICES[key].title, html: renderPriceTable(key), wide: true });
        };

        btn.addEventListener('click', onClick);
        cleanups.push(() => btn.removeEventListener('click', onClick));
    });
}

/* ------------------------------------------------------------------ 생명주기 */

export function mount() {
    initSlider();
    initPriceButtons();
}

export function unmount() {
    clearInterval(timer);
    timer = null;
    cleanups.forEach((fn) => fn());
    cleanups = [];
}
