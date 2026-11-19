// 공용 모달 — index.html 의 #modal 을 재사용한다.
// 장비 설명(본원소개)과 비급여 안내표(메인)가 같은 모달을 쓴다.

const el = () => document.getElementById('modal');

let lastFocused = null;

function onKeydown(e) {
    if (e.key === 'Escape') closeModal();
}

export function openModal({ title = '', html = '', wide = false } = {}) {
    const modal = el();
    if (!modal) return;

    lastFocused = document.activeElement;

    modal.querySelector('#modal-title').textContent = title;
    modal.querySelector('#modal-body').innerHTML = html;

    // 표가 들어가는 비급여 안내는 조금 더 넓게 연다.
    const panel = modal.querySelector('[role="dialog"]');
    panel.classList.toggle('max-w-3xl', wide);
    panel.classList.toggle('max-w-2xl', !wide);

    modal.hidden = false;
    document.body.classList.add('overflow-hidden');
    document.addEventListener('keydown', onKeydown);

    modal.querySelector('[data-modal-close]')?.focus();
}

export function closeModal() {
    const modal = el();
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    modal.querySelector('#modal-body').innerHTML = '';
    document.body.classList.remove('overflow-hidden');
    document.removeEventListener('keydown', onKeydown);

    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
}

// 닫기 버튼과 배경 클릭은 셸에 한 번만 연결해 두면 된다.
export function initModal() {
    const modal = el();
    if (!modal) return;

    modal.addEventListener('click', (e) => {
        if (e.target.closest('[data-modal-close]')) closeModal();
    });
}
