// 본원소개 — 보유장비/내부전경 전환, 장비 설명 모달, 네이버 지도

import { openModal } from '../modal.js';
import { EQUIPMENT, renderEquipment, photoSrc } from '../data/equipment.js';

const NAVER_MAPS = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=e2084xtgmr';
const HOSPITAL = { lat: 35.8581272, lng: 128.6252464 };

const DEFAULT_MACHINE = { 6: 'MRI(자기공명영상)', 8: 'BMD(골밀도검사)' };
const DEFAULT_PHOTO = { 6: '6입구전경', 8: '8대기실' };

const TAB_ON = 'text-slateink border-slateink';
const TAB_OFF = 'text-slate-400 border-transparent';

const ADDRESS = '대구 수성구 동대구로 311 범어 애플타워';
const PLACE = '홍앤전신경과신경외과의원';

let mapsLoader = null;
let map = null;
let mapWatchdog = null;
let selectedMachine = DEFAULT_MACHINE[6];
let listeners = [];

function on(el, type, handler) {
    el.addEventListener(type, handler);
    listeners.push(() => el.removeEventListener(type, handler));
}

/* ------------------------------------------------------------------- 지도 */

function loadNaverMaps() {
    if (window.naver && window.naver.maps) return Promise.resolve();

    // 도메인이 등록돼 있지 않으면 네이버가 이 전역 함수를 호출한다.
    window.navermap_authFailure = showMapFallback;

    if (!mapsLoader) {
        mapsLoader = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = NAVER_MAPS;
            script.onload = resolve;
            script.onerror = () => {
                mapsLoader = null;
                showMapFallback();
                reject(new Error('네이버 지도를 불러오지 못했습니다.'));
            };
            document.head.appendChild(script);
        });
    }

    return mapsLoader;
}

// 지도가 뜨지 않을 때(도메인 미등록 등) 빈 상자 대신 주소와 바로가기를 보여 준다.
function showMapFallback() {
    clearTimeout(mapWatchdog);

    const el = document.getElementById('map');
    if (!el || el.dataset.fallback) return;

    el.dataset.fallback = '1';
    el.className = el.className.replace('bg-slate-200', 'bg-slate-50 border border-slate-200');
    el.innerHTML = `
        <div class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <p class="text-lg font-bold text-slate-800">${PLACE}</p>
            <p class="text-[15px] leading-7 text-slate-600">${ADDRESS}<br>범어역 3번 출구에서 도보 1분</p>
            <div class="flex flex-wrap items-center justify-center gap-2">
                <a href="https://map.naver.com/p/search/${encodeURIComponent(PLACE)}" target="_blank" rel="noopener"
                   class="rounded-lg bg-slateink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">네이버 지도</a>
                <a href="https://map.kakao.com/?q=${encodeURIComponent(PLACE)}" target="_blank" rel="noopener"
                   class="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">카카오맵</a>
            </div>
        </div>`;
}

async function initMap() {
    try {
        await loadNaverMaps();
    } catch (err) {
        console.error(err);

        return;
    }

    // 지도를 그리는 사이에 다른 페이지로 이동했을 수 있다.
    const el = document.getElementById('map');
    if (!el) return;

    let center;
    try {
        center = new naver.maps.LatLng(HOSPITAL.lat, HOSPITAL.lng);
        map = new naver.maps.Map(el, { center: center.destinationPoint(0, 200), zoom: 15 });
    } catch (err) {
        console.error('지도를 그리지 못했습니다.', err);
        showMapFallback();

        return;
    }

    // 인증에 실패하면 예외 없이 조용히 비어 있으므로 타일이 그려졌는지 확인한다.
    mapWatchdog = setTimeout(() => {
        if (el.children.length === 0) showMapFallback();
    }, 5000);

    const marker = new naver.maps.Marker({ map, position: center });
    const infowindow = new naver.maps.InfoWindow({
        content: [
            '<div style="padding:10px 14px;line-height:1.6">',
            '   <strong>홍앤전신경과신경외과의원</strong><br>',
            '   대구 수성구 동대구로 311 범어 애플타워<br>',
            '   범어동 563-4',
            '</div>',
        ].join(''),
    });

    naver.maps.Event.addListener(marker, 'click', () => {
        if (infowindow.getMap()) infowindow.close();
        else infowindow.open(map, marker);
    });

    infowindow.open(map, marker);
}

/* ------------------------------------------------------------ 장비 · 전경 선택 */

function setMachine(name) {
    const item = EQUIPMENT[name];
    if (!item) return;

    selectedMachine = name;

    const img = document.querySelector('[data-machine-image]');
    if (img) {
        img.src = '/images/' + item.image;
        img.alt = item.title;
    }
}

function setPhoto(name) {
    const img = document.querySelector('[data-photo-image]');
    if (!img || !name) return;

    img.src = photoSrc(name);
    img.alt = name.replace(/^[68]/, '') + ' 사진';
}

// 탭 버튼은 data-floor-tab="machine:6", 목록 항목은 data-floor="6" 으로 구분한다.
// (한때 둘 다 data-floor 였는데, 항목 클릭이 부모 li 로 버블링되면서 층 전환으로 오인돼 이미지가 지워졌다.)
function switchFloor(group, floor) {
    if (!group || !floor) return;

    document.querySelectorAll(`[data-group="${group}"]`).forEach((li) => {
        li.hidden = li.dataset.floor !== floor;
    });

    document.querySelectorAll(`[data-floor-tab^="${group}:"]`).forEach((btn) => {
        const active = btn.dataset.floorTab === `${group}:${floor}`;
        btn.className = `text-[15px] font-semibold transition border-b-2 pb-1 ${active ? TAB_ON : TAB_OFF}`;
    });

    if (group === 'machine') setMachine(DEFAULT_MACHINE[floor]);
    else setPhoto(DEFAULT_PHOTO[floor]);
}

/* ------------------------------------------------------------------ 생명주기 */

export function mount() {
    switchFloor('machine', '6');
    switchFloor('photo', '6');

    document.querySelectorAll('[data-floor-tab]').forEach((btn) => {
        on(btn, 'click', (e) => {
            e.preventDefault();
            const [group, floor] = btn.dataset.floorTab.split(':');
            switchFloor(group, floor);
        });
    });

    document.querySelectorAll('[data-machine]').forEach((a) => {
        on(a, 'click', (e) => {
            e.preventDefault();
            setMachine(a.dataset.machine);
        });
    });

    document.querySelectorAll('[data-photo]').forEach((a) => {
        on(a, 'click', (e) => {
            e.preventDefault();
            setPhoto(a.dataset.photo);
        });
    });

    const explain = document.querySelector('[data-explain]');
    if (explain) {
        on(explain, 'click', () => {
            const item = EQUIPMENT[selectedMachine];
            if (item) openModal({ title: item.title, html: renderEquipment(selectedMachine) });
        });
    }

    initMap();
}

export function unmount() {
    listeners.forEach((off) => off());
    listeners = [];

    clearTimeout(mapWatchdog);
    mapWatchdog = null;

    if (map && typeof map.destroy === 'function') map.destroy();
    map = null;
}
