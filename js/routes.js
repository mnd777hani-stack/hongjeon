// 라우트 정의
//   path   : 매칭할 경로 (끝 슬래시 / .html 은 라우터가 정규화)
//   view   : /pages/<view>.html 조각
//   module : /js/views/<module>.js  (mount/unmount 를 export)
//   title  : document.title

const SITE = '홍앤전 신경과신경외과';

// 공지사항 게시물 — 새 글을 추가할 때 이 배열에 번호를 넣어야 라우팅이 잡힌다.
export const POSTS = ['1', '2', '3', '4'];

export const routes = [
    {
        path: '/',
        view: 'main',
        module: 'main',
        title: SITE,
        description: '대구 수성구 범어동 홍앤전 신경과신경외과 — 진료시간, 진료안내, 공지사항',
    },
    {
        path: '/intro',
        view: 'intro',
        module: 'intro',
        title: `본원소개 | ${SITE}`,
        description: '의료진 소개, 보유장비와 내부 전경, 오시는 길을 안내합니다.',
    },
    {
        path: '/info',
        view: 'info',
        module: 'info',
        title: `진료정보 | ${SITE}`,
        description: '혈액순환·두통, 척추디스크·협착증, 어지럼증·이명, 손발저림, 오십견·관절통증 진료 안내',
    },
    {
        path: '/post_list',
        view: 'post_list',
        title: `공지사항 | ${SITE}`,
        description: '홍앤전 신경과신경외과 공지사항',
    },
];

export const notFound = {
    view: '404',
    title: `페이지를 찾을 수 없습니다 | ${SITE}`,
    description: '',
    status: 404,
};

// /post_list/4, /post_list/4.html → 게시물 라우트
export function matchPost(path) {
    const m = /^\/post_list\/([^/]+)$/.exec(path);
    if (!m || !POSTS.includes(m[1])) return null;

    return {
        path,
        view: `post-${m[1]}`,
        title: `공지사항 | ${SITE}`,
        description: '홍앤전 신경과신경외과 공지사항',
    };
}
