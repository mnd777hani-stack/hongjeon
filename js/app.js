import { start } from './router.js';

start().catch((err) => console.error('초기 렌더링 실패', err));
