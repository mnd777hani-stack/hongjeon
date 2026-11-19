// 비급여 안내 — 메인 하단 버튼에서 모달로 연다.
// 금액이 바뀌면 이 파일의 rows 만 고치면 된다. ([항목, 금액])

export const PRICES = {
    step1: {
        title: '검사비용',
        note: '아래 금액은 비급여 항목으로 건강보험이 적용되지 않습니다.',
        rows: [
            ['동맥경화도검사', '40,000'],
            ['혈관 + 뇌혈류 초음파', '70,000'],
            ['경동맥 + 뇌혈류 초음파', '150,000'],
            ['경동맥 초음파', '80,000'],
            ['기타 부위(근골격 및 기타 부위) 초음파', '80,000'],
            ['골밀도검사', '50,000'],
            ['MRI 촬영 — 뇌, 머리', '380,000'],
            ['MRI 촬영 — 뇌혈관 또는 경부혈관', '330,000'],
            ['MRI 촬영 — 뇌 + 뇌혈관', '600,000'],
            ['MRI 촬영 — 뇌 + 뇌혈관 + 경부혈관', '750,000'],
            ['MRI 촬영 — 전척추', '480,000'],
            ['MRI 촬영 — 근골격 및 척추 등 기타부위', '380,000'],
            ['MRI 촬영 — 부분촬영', '120,000 ~ 250,000'],
            ['MRI 조영제', '100,000'],
        ],
    },

    step2: {
        title: '제증명수수료',
        rows: [
            ['영문 진단서', '20,000'],
            ['일반 진단서', '20,000'],
            ['근로능력평가용 진단서', '10,000'],
            ['상해진단서 — 3주 미만', '100,000'],
            ['상해진단서 — 3주 이상', '150,000'],
            ['후유장애진단서', '15,000'],
            ['진료확인서 일반', '3,000'],
            ['진료확인서 보험용', '10,000'],
            ['장애인증명서', '1,000'],
            ['진료기록사본 (1~5매)', '1매당 1,000'],
            ['진료기록사본 (6매 이상)', '1매당 100'],
            ['제증명서사본', '1,000'],
            ['영상 CD copy', '10,000'],
            ['영상 DVD copy', '20,000'],
        ],
    },

    step3: {
        title: '약제비',
        rows: [
            ['대상포진백신 — 조스타박스, 스카이조스터', '170,000'],
            ['대상포진백신 — 싱그릭스', '250,000'],
            ['폐렴백신', '130,000'],
            ['독감백신 (4가)', '40,000'],
            ['DNA 주사 (플라센텍스)', '80,000'],
            ['비타민D 주사', '35,000'],
            ['프롤로주사 (부위별)', '1만 ~ 10만'],
            ['보톡스', '150,000'],
            ['MRI 조영제 (가도브릭스)', '100,000'],
            ['영양수액제', '4만 ~ 6만'],
        ],
    },

    step4: {
        title: '치료재료대',
        rows: [
            ['경추보호대', '15,000'],
            ['경추보호대 — 필라델피아', '25,000'],
            ['손목보호대', '15,000'],
            ['요추보호대 A', '40,000'],
            ['요추보호대 B', '80,000'],
            ['팔걸이', '5,000'],
            ['깁스신발', '7,000'],
        ],
    },
};

const escape = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function renderPriceTable(key) {
    const item = PRICES[key];
    if (!item) return '';

    const rows = item.rows
        .map(
            ([name, price]) => `
            <tr class="border-t border-slate-200 even:bg-slate-50/70">
                <td class="px-3 py-2.5 sm:px-4">${escape(name)}</td>
                <td class="whitespace-nowrap px-3 py-2.5 text-right font-semibold tabular-nums sm:px-4">${escape(price)}</td>
            </tr>`
        )
        .join('');

    return `
        ${item.note ? `<p class="mb-4 text-sm text-slate-500">${escape(item.note)}</p>` : ''}
        <div class="overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full min-w-[320px] border-collapse text-left text-[15px]">
                <thead>
                    <tr class="bg-slateink text-white">
                        <th scope="col" class="px-3 py-3 font-semibold sm:px-4">항목</th>
                        <th scope="col" class="px-3 py-3 text-right font-semibold sm:px-4">금액 (원)</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}
