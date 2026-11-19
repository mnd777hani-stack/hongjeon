# 홍앤전 신경과신경외과 (hongjeon.co.kr)

Node.js(Express + EJS + MySQL) 기반이던 사이트를 **빌드 없는 정적 SPA**로 전환한 결과물입니다.
서버 프로그램과 데이터베이스가 없고, 스타일은 **Tailwind CSS 유틸리티 클래스로만** 작성합니다
(별도 `.css` 파일 없음). GitHub Pages로 배포합니다.

## 로컬 실행

```bash
npm run dev          # http://localhost:8001
PORT=3000 npm run dev
```

`dev-server.mjs`는 외부 의존성이 없는 Node 기본 모듈 전용 서버입니다(`npm install` 불필요).
**실제 파일이 있으면 그 파일을, 없으면 `index.html`을** 돌려주는 SPA fallback 방식으로 GitHub Pages(404.html fallback)와
동작이 같습니다. 그래서 `/post_list/14` 같은 주소를 새로고침하거나 직접 열어도 로컬과
배포본이 동일하게 동작합니다.

> `python3 -m http.server`로도 첫 화면은 뜨지만 SPA fallback이 없어 깊은 주소 새로고침이
> 404가 됩니다. 확인은 `npm run dev`로 하세요.

## 배포 (GitHub Pages)

`main`에 push하면 `.github/workflows/deploy.yml`이 자동 배포합니다. 빌드 단계는 없습니다.

- 저장소 Settings → Pages → Source를 **GitHub Actions**로 설정합니다.
- GitHub Pages에는 rewrite가 없어, 워크플로가 `index.html`을 `404.html`로 복사합니다.
  모르는 경로는 404.html(SPA 셸)이 받아 클라이언트 라우터가 처리합니다.
- `CNAME`에 커스텀 도메인(hongjeon.co.kr)이 지정되어 있습니다. 루트 경로(`/`) 기준이므로
  도메인 없이 `<계정>.github.io/<저장소>/`로 배포하면 절대 경로가 깨집니다.

## 구조

```
index.html          SPA 셸 — Tailwind 설정, 헤더, #app, 푸터, 공용 모달
CNAME               GitHub Pages 커스텀 도메인
.github/workflows/  GitHub Pages 자동 배포
dev-server.mjs      로컬 개발 서버 (의존성 없음)

js/app.js           진입점
js/router.js        라우터 — 경로 정규화, 조각 fetch/캐시, 링크 가로채기, prefetch
js/routes.js        라우트 표 (경로 · 조각 · 모듈 · title/description)
js/modal.js         공용 모달 (열기/닫기, ESC·배경 클릭)
js/data/prices.js   비급여 안내 4종 (검사비용·제증명수수료·약제비·치료재료대)
js/data/equipment.js 보유장비 13종 설명 + 내부전경 사진 목록
js/views/main.js    메인 — 갤러리 슬라이드, 비급여 모달
js/views/intro.js   본원소개 — 장비/전경 전환, 설명 모달, 네이버 지도
js/views/info.js    진료정보 — 진료과목 탭

pages/*.html        라우트별 HTML 조각 (문서가 아니라 조각)
images/ txt/        정적 리소스
```

### 라우트

| 주소 | 조각 | 비고 |
|---|---|---|
| `/` | `pages/main.html` | 메인 |
| `/intro` | `pages/intro.html` | 본원소개 |
| `/info` | `pages/info.html` | `?sec=1`~`5`로 항목 선택 (기본 1) |
| `/post_list` | `pages/post_list.html` | 공지사항 목록 |
| `/post_list/{1,2,3,4}` | `pages/post-*.html` | 공지사항 본문 |
| 그 외 | `pages/404.html` | |

라우터가 끝 슬래시와 `.html`을 정규화하므로 `/intro/`, `/post_list/14.html` 같은 기존 주소로
들어와도 같은 화면이 열립니다.

## 스타일 — Tailwind

`index.html`에서 Play CDN(`cdn.tailwindcss.com`, typography 플러그인 포함)을 불러오고,
색상 토큰을 `tailwind.config`에 정의해 씁니다.

| 토큰 | 값 | 쓰임 |
|---|---|---|
| `ink` | `#48499c` | 네비게이션 · 링크 강조 |
| `slateink` | `#6c6c8e` | 본문 강조 · 테두리 · 버튼 |
| `hong` | `#ee8f23` | 로고 "홍" |
| `jeon` | `#fdcb08` | 로고 "전" |

주의할 점 두 가지:

- `hidden` 속성으로 요소를 숨기는데, `grid`/`flex` 같은 display 유틸리티가 브라우저 기본
  `[hidden]` 규칙을 이겨 버립니다. `index.html`의 `[hidden]{display:none!important}` 한 줄이
  이를 눌러 줍니다. 지우지 마세요.
- grid/flex 자식에서 제목을 `truncate` 할 때는 부모에 `min-w-0`이 있어야 합니다. 없으면
  자식의 `white-space:nowrap` 때문에 칸이 화면 밖으로 늘어납니다.

> Play CDN은 브라우저에서 클래스를 훑어 스타일을 만듭니다. 트래픽이 늘어 최적화가 필요해지면
> Tailwind CLI로 CSS를 빌드해 정적 파일로 바꾸는 편이 좋습니다(마크업은 그대로 두고 교체 가능).

## 공지사항 추가·수정

DB가 없으므로 게시물은 조각 파일로 관리합니다.

1. `pages/post-*.html` 중 하나를 복사해 `pages/post-<다음 번호>.html`로 만들고 제목·등록일·본문을 수정합니다.
   번호는 등록 순서대로 1부터 이어 붙입니다.
2. `js/routes.js`의 `POSTS` 배열에 새 번호를 추가합니다. (여기 없으면 404 처리됩니다)
3. `pages/post_list.html`의 `<li>` 블록을 최신 글이 위로 오도록 추가합니다.
4. `pages/main.html`의 공지 영역에 최신 4건을 맞춥니다.
5. 새 글의 이전글 링크와 직전 글의 다음글 링크를 서로 연결합니다.

> 옛 주소(DB 시절 IDX) `/post_list/12`, `/post_list/14` 는 `js/routes.js`의 `LEGACY_POSTS`가
> 새 번호로 넘겨 줍니다. 번호 체계를 또 바꾸면 이 표도 함께 갱신하세요.

## 비급여 금액 수정

`js/data/prices.js`의 `rows` 배열(`[항목, 금액]`)만 고치면 메인 버튼에서 열리는 모달에 반영됩니다.

## 정적화하면서 없어진 기능

- 관리자 페이지 / 로그인 / 회원가입 / 게시물 등록·수정·삭제 (`/SR`)
- 게시물 조회수 카운트 (표시 항목에서 제거)
- 건강칼럼 게시판 (등록된 글이 없어 삭제)

## 참고 — SEO

SPA라 첫 응답은 빈 셸이고 본문은 자바스크립트가 채웁니다. 구글은 렌더링 후 색인하지만
일부 크롤러·SNS 미리보기는 본문을 읽지 못합니다. 검색 노출이 중요해지면 라우트별 정적 HTML을
함께 생성(프리렌더)하는 방식을 얹는 것이 좋습니다.
