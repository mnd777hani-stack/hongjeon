// 진료정보 — 노출할 항목은 ?sec=01 ~ 05 로 전달받는다. 값이 없으면 첫 항목을 연다.

const TAB_ON = 'bg-slate-100 shadow-[inset_0_-4px_0_0_teal]';
const TAB_OFF = 'bg-white hover:bg-slate-50';

let listeners = [];

function showSection(no) {
    document.querySelectorAll('[data-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.panel !== String(no);
    });

    document.querySelectorAll('[data-sec]').forEach((btn) => {
        const active = btn.dataset.sec === String(no);
        btn.className =
            'flex h-full w-full flex-col items-center gap-3 px-3 py-7 text-center transition ' +
            (active ? TAB_ON : TAB_OFF);
    });
}

export function mount(url) {
    const sec = Number(url?.searchParams.get('sec')) || 1;
    showSection(sec >= 1 && sec <= 5 ? sec : 1);

    document.querySelectorAll('[data-sec]').forEach((btn) => {
        const handler = () => showSection(btn.dataset.sec);

        btn.addEventListener('click', handler);
        listeners.push(() => btn.removeEventListener('click', handler));
    });
}

export function unmount() {
    listeners.forEach((off) => off());
    listeners = [];
}
