// 본원소개 — 보유장비 설명(모달)과 내부전경 사진 목록.
//   text   : 문단
//   points : ▶ 로 시작하던 항목들

export const EQUIPMENT = {
    'MRI(자기공명영상)': {
        title: 'MRI(자기공명영상) — SIEMENS 1.5T MAGNETOM AVANTO',
        image: 'MRI(자기공명영상).jpg',
        text: [
            '독일 지멘스사의 MRI 장비로 전신에 대해서 SNR을 유지하고 병렬영상 획득 방식으로 모든 방향에서 촬영을 할 수 있기 때문에 환자분의 자세 재교정 없이 한 번으로 가능하여 편안하게 검사를 받을 수 있습니다.',
            'MRI 중 마그넷의 길이가 가장 짧고 거꾸로 촬영도 가능하여 편안한 여건을 조성하기 때문에 폐쇄공포증이 있는 환자도 효과적으로 검사 받을 수 있게 합니다.',
        ],
    },

    'SONO(초음파)-6': {
        title: 'SONO(초음파) — HITACHI ALOKA PROSOUND ALPHA7',
        image: 'SONO6.jpg',
        points: [
            '경동맥 초음파 — 비침습적인 방법인 고해상도 초음파를 이용하여 경동맥 내중막 두께를 측정함으로써 조기 죽상동맥경화증의 진단 및 초기 진료에 이용하고 있습니다.',
            '상복부 초음파 — 초음파를 생성하는 탐촉자를 상복부에 대고 초음파를 보낸 다음 되돌아오는 초음파를 실시간 영상화하는 검사입니다. 간편하고 인체에 해가 없기 때문에 상복부 증상이 있을 때 가장 널리 이용되고 있습니다. (급성 혹은 만성 간염, 복부 장기의 원발성 및 전이성 종양, 복수, 농양, 담낭염 및 담도염과 결석, 급성 혹은 만성 췌장염)',
            '기타 — 근골격계 초음파',
        ],
    },

    'TCD(뇌혈류초음파)': {
        title: 'TCD(뇌혈류초음파) — VIASYS',
        image: 'TCD(뇌혈류초음파).png',
        text: [
            '뇌혈류 초음파 검사는 뇌 혈류를 초음파로 측정해 여러 뇌 혈관의 혈류속도, 혈류량, 혈류방향 등을 직접 관찰함으로써 혈관의 협착 및 혈관 내에 죽종을 확인하여 각 혈관의 혈액 소통 상태를 파악하는 검사방법입니다.',
            '급성 뇌졸중(중풍)의 혈관이 막힌 정도를 초기에 관찰하고 혈전 용해 등의 치료에 적용할 수 있고, 경막하 출혈 시 혈관 연축의 조기진단, 편두통의 진단에 매우 중요한 검사입니다. 또한 초음파를 이용해 전혀 고통이 없고 특별한 준비과정이 필요 없으며 검사에 따르는 합병증이 없습니다.',
        ],
    },

    'EEG(뇌파검사)': {
        title: 'EEG(뇌파검사) — Nihon Kohden EEG',
        image: 'EEG(뇌파검사).png',
        text: [
            '뇌의 기능적 이상이 있을 때나 발작이 발생하는 경우에 도움이 되는 검사이며, 그 외에 기타 신경계를 침범하는 감염이 있거나 독성 또는 대사질환이 있을 때도 특징적인 뇌파소견이 관찰되어 뇌의 기질적 질환(뇌종양 감염, 두부외상, 의식장애, 뇌막염 등)을 생각할 수 있습니다.',
        ],
    },

    'BMD(골밀도검사)': {
        title: 'BMD(골밀도검사) — GE DPX BRAVO',
        image: 'BMD골밀도.jpg',
        text: [
            '인체 특정 부위의 뼈의 양을 골밀도 지표로 측정하고 정상적인 골밀도와 비교하여 뼈의 양이 얼마나 감소 또는 증가되었는지를 평가하는 검사이며, 짧은 측정시간과 저선량 방사선을 이용합니다.',
        ],
        points: [
            '갱년기에 접어들거나 폐경 후의 여성',
            '당뇨병을 앓고 있는 분',
            '과다흡연, 과음, 커피, 운동부족 및 짜게 먹는 분',
            '우유를 거의 마시지 않거나 다이어트 경험이 있는 여성',
        ],
    },

    'CT(전산화단층촬영)': {
        title: 'CT(전산화단층촬영) — SIEMENS SOMATOM Scope',
        image: 'CT(전산화단층촬영).png',
        text: [
            '머리의 뇌혈관 장애, 뇌종양, 두부외상, 염증질환 등의 두부질환 식별이 가능하고 병변의 형태와 위치를 정확하게 얻을 수 있습니다. 흉부, 복부, 간, 담낭, 췌장, 신장, 부신 등의 질병을 검사할 수 있고 골반, 척추, 척수질환검사, 고관절 질환 검사도 가능합니다.',
        ],
    },

    'DR(컴퓨터영상처리)': {
        title: 'DR(컴퓨터영상처리장치) & PACS(의료영상저장전송시스템)',
        image: 'DR(컴퓨터영상처리장치).jpg',
        text: [
            'PACS(Picture Archiving and Communication System)는 각종 영상촬영장치(Modality)로 촬영한 영상들을 DR(Digital Radiography) 디지털 장비를 통해 디지털화하여 네트워크를 통해 각 단말기로 전송함으로써, 진찰실 등 워크스테이션이 있는 곳이면 어디에서든 실시간으로 환자의 영상을 조회할 수 있는 시스템입니다.',
        ],
    },

    'EMG(근전도검사)': {
        title: 'EMG(근전도검사) — Nihon Kohden KD-109',
        image: 'EMG(근전도검사).png',
        text: ['근전도기기를 사용하여 근육의 전기적 활성도를 확인하는 검사방법입니다.'],
        points: [
            '손발저림, 전신떨림 증상',
            '각종 통증(신경통, 요통, 오십견)',
            '안면경련, 신경마비, 근육마비 등',
            '근골격계 증상',
        ],
    },

    'NCV(신경전도검사)': {
        title: 'NCV(신경전도검사) — Nihon Kohden neuropack',
        image: 'NCV(신경전도검사).png',
        text: ['신경계 질환을 확인하는 검사입니다.'],
        points: ['길랑바레 증후군, 안면 신경마비, 경추 및 요추의 신경뿌리병증, 외상에 의한 신경마비 등'],
    },

    'SONO(초음파검사)-8': {
        title: 'SONO(초음파) — HITACHI ALOKA F37',
        image: 'SONO8.jpg',
        text: [
            '경동맥 초음파 — 비침습적인 방법인 고해상도 초음파를 이용하여 경동맥 내중막 두께를 측정함으로써 조기 죽상동맥경화증의 진단 및 조기 치료에 이용하고 있습니다.',
        ],
    },

    'X-Ray(일반촬영)': {
        title: 'X-ray(일반촬영)',
        image: 'X-ray(일반촬영).png',
        text: [
            '인체를 촬영하되 조영제나 기구 등을 사용하지 않고 단순히 전후사진 한 장 또는 필요에 따라 측면 또는 대각선을 촬영합니다.',
        ],
    },

    '동맥경화검사': {
        title: '동맥경화검사 — VaSera VS-1000',
        image: '동맥경화검사.jpg',
        points: [
            '혈관 관련 질환 조기진단',
            '심근경색, 심부전, 협심증 조기진단',
            '동맥경화 조기진단 및 고혈압 관리',
            '혈관노화 상태 정기점검',
        ],
    },

    'C-ARM': {
        title: 'C-ARM(이동형 엑스선 투시촬영장치) — GENORAY ZEN 2090-Turbo',
        image: 'C-ARM.png',
        text: [
            '고출력 HLF(High Level Fluoroscopy) Mode를 통해 동급 최대 투시 및 투과력을 지원하여 고품질 촬영이 가능하며, Low Dose Mode와 세분화된 Pulse Mode, Laser Aimer를 통해 환자와 시술자의 피폭선량을 대폭 저감합니다.',
            'DICOM RDSR(Radiation Dose Structured Reporting)을 통해 피폭선량 관리를 돕습니다.',
        ],
    },
};

// 내부전경 — 항목명과 파일명이 다른 경우만 따로 적는다.
export const PHOTO_ALIAS = {
    '8첨단CT장비': '8첨단_CT장비.jpg',
};

export const photoSrc = (name) => '/images/' + (PHOTO_ALIAS[name] || name + '.jpg');

const escape = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function renderEquipment(key) {
    const item = EQUIPMENT[key];
    if (!item) return '';

    const text = (item.text || [])
        .map((p) => `<p class="mb-3 last:mb-0">${escape(p)}</p>`)
        .join('');

    const points = (item.points || []).length
        ? `<ul class="mt-4 space-y-2">${item.points
              .map(
                  (p) => `
                <li class="flex gap-2.5">
                    <span class="mt-0.5 shrink-0 text-slateink">▶</span>
                    <span>${escape(p)}</span>
                </li>`
              )
              .join('')}</ul>`
        : '';

    return `
        <img src="/images/${item.image}" alt="${escape(item.title)}"
             class="mb-5 h-52 w-full rounded-xl bg-slate-100 object-contain sm:h-64">
        ${text}${points}`;
}
