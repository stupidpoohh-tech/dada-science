# 움직이는 지구과학 — 인터랙티브 디지털 교과서

고등학교 지구과학 내신 학습용 웹 교재입니다.

**원문 학습 → 움직이는 그림(팝업) → 개념 확인 → 학습 완료 → 기본 예제 → 내신 대비 → 오답 복습**

- 대단원마다 **한 장의 연속된 교재**: 소챕터는 제목·번호·구분선으로만 나뉘고 스크롤로 이어집니다. 왼쪽 목차(가로 화면) 또는 위쪽 접이식 목차(세로·휴대폰)가 현재 읽는 소챕터를 자동 강조합니다.
- 원문의 그림·용어 중 **재생 표시가 있는 것만** 누르면 단계별 움직이는 그림이 열리고, 닫으면 읽던 위치로 돌아옵니다. 마지막 단계의 확인 문제를 맞히면 그 개념이 학습 완료됩니다.
- **필기**: 펜·형광펜·레이저 포인터·지우개, 실행 취소·다시 실행, 색·굵기, 표시/숨기기, 백업 내보내기·가져오기. 자동 저장(IndexedDB).
- **문제**: 기본 예제(문항별 즉시 채점), 내신 대비(시험 모드 → 제출 후 총점·정오표·해설·틀린 개념), 오답 노트(자동 등록·다시 풀기·재풀이 기록). 해설과 결과의 개념 링크는 원문의 정확한 위치로 이동해 강조하고, 관련 팝업 다시 보기와 ‘문제로 돌아가기’를 제공합니다.

## 현재 콘텐츠 상태

| 대단원 | 원문 | 움직이는 그림 | 문제 |
|---|---|---|---|
| Ⅱ. 해수의 운동과 순환 | 손글씨 노트에서 옮김(5개 소챕터) | 11개 | 데모 문항 12개(교체 필요) |
| Ⅲ. 강수 과정과 대기의 운동 | 손글씨 노트에서 옮김(6개 소챕터) | 4개 | 입력 대기 |

손글씨 판독이 불확실한 곳과 확인이 필요한 내용은 [`docs/REVIEW.md`](docs/REVIEW.md)에 정리했습니다. 원본 자료는 `source/`에 있습니다.

## 실행

Node.js 20 이상이 필요합니다.

```bash
npm install
```

```bash
npm run dev
```

## 빌드와 배포

```bash
npm run build
```

`dist/`가 완성된 정적 사이트입니다(`base: './'`, 해시 라우팅이라 어느 경로에 올려도 동작).

- **GitHub Pages**: `.github/workflows/deploy.yml`이 `main`에 푸시될 때 빌드·배포합니다. 저장소 Settings → Pages → Source를 **GitHub Actions**로 한 번 지정하세요.
- **Netlify / Vercel**: 빌드 명령 `npm run build`, 출력 폴더 `dist`.
- **한 파일 빌드**: `npm run build:single` → `artifact/moving-earth-science.html`(원본 노트 사진은 포함되지 않으므로 `public/source/`를 함께 올려야 합니다).

## 콘텐츠 추가·수정

| 하려는 일 | 파일 |
|---|---|
| 원문 수정·추가 | `src/content/manuscripts/<단원>.md` (형식: 같은 폴더의 `README.md`) |
| 대단원·소챕터 추가, 학습 완료 조건 | `src/content/units.ts` (`completion: { type: 'manual' }`이면 소챕터 끝의 체크로 완료) |
| 개념(문제 ↔ 원문 ↔ 팝업 연결) | `src/content/concepts.ts` |
| 문제 입력 | `src/content/questions/<단원>.ts` |
| 팝업 단계 설명·확인 문제 | `src/content/popups.ts` |
| 팝업 그림 추가 | `src/scenes/`에 컴포넌트를 만들고 `src/scenes/index.ts`에 등록 |
| 원문 정적 그림 | `src/figures/index.tsx` (`@figure fig=키`) |

### 문제 입력 예

```ts
{
  id: 'ocean-e-07',           // 한 번 정하면 바꾸지 않기(오답 기록 연결)
  unitId: 'ocean', set: 'exam', number: 7,
  type: 'tf-set',             // choice | ox | tf-set(ㄱ·ㄴ·ㄷ) | short | essay
  stem: '그림은 … 옳은 것만을 <보기>에서 있는 대로 고른 것은?',
  figure: { src: 'questions/ocean-07.png', caption: '…' },   // public/ 기준 이미지
  statements: ['…', '…', '…'],
  choices: ['ㄱ', 'ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'],
  answer: 2,                  // 0부터 센 선택지 번호 / OX는 'O'·'X' / 단답형은 정답 문자열
  accept: ['…'],              // 단답형에서 인정할 답
  modelAnswer: '…', rubric: ['…'],   // 서술형(자동 채점하지 않음)
  explanation: '…', points: 4,
  conceptIds: ['ocean.ekman', 'ocean.upwelling'],
}
```

## 구조

```
src/
├─ content/            단원·원문·개념·팝업·문제 데이터
├─ lib/                원문 파서, 진도 저장(localStorage, 버전·이전 기록 변환), 필기 저장(IndexedDB), 라우터
├─ components/
│  ├─ textbook/        UnitPage(AppShell), ChapterNavigation, ContinuousTextbook, ConceptBlock, InteractiveFigure, PageScaler
│  ├─ popup/           ConceptPopup (SceneViewer, StepControls, ConceptQuiz 재사용)
│  ├─ annotation/      AnnotationSurface(필기 레이어·펜·형광펜·레이저·지우개), AnnotationToolbar
│  └─ assessment/      PracticePage, ExamPage(결과 보고서), QuestionRenderer, WrongAnswerNotebook
├─ scenes/             움직이는 그림(SVG) 15종
└─ figures/            원문 정적 그림(SVG)
```

## 필기의 동작 방식

- **입력 구분**: 필기 도구를 고르면 Apple Pencil·마우스는 필기, 손가락은 스크롤과 버튼 조작입니다. iPadOS Safari에서는 펜 터치(`touchType: 'stylus'`)만 스크롤을 막습니다. 펜이 없는 기기는 도구 모음 ‘더 보기 → 손가락으로도 필기’를 켭니다(켜 있는 동안은 손가락 스크롤이 멈춤). 손 모양 버튼(탐색)을 누르면 필기가 꺼집니다.
- **그림과의 충돌 방지**: 필기 획이 시작된 입력의 클릭은 막으므로, 그림 위에 동그라미를 그려도 팝업이 열리지 않습니다. 팝업 안에서는 ‘그림에 필기’를 켤 때만 필기되고, 그동안 그림 조작은 멈춥니다.
- **위치 보존**: 획은 화면 좌표가 아니라 원문 블록(`data-block-id`) 기준 좌표로 저장됩니다. 본문은 고정 판형(720 논리 px)을 화면에 맞게 확대·축소하므로 화면 크기가 바뀌어도 줄바꿈이 같아 필기가 글자 위에 그대로 있습니다. 폭 600px 미만 휴대폰에서는 읽기 위해 줄바꿈을 다시 하므로 필기는 블록 비율로 맞춘 근사 위치에 표시됩니다.
- **저장**: 대단원별·팝업별로 IndexedDB에 자동 저장됩니다. 이 기기의 브라우저에만 남으며 다른 기기와 동기화되지 않습니다. ‘필기 백업 파일 내보내기’로 JSON 파일을 받아 두고, ‘가져오기’로 합칠 수 있습니다.

## 검증

자동 테스트(Playwright, 데스크톱 Chromium)로 확인한 항목과 실제 기기에서 확인할 항목은 [`docs/TESTING.md`](docs/TESTING.md)에 있습니다.
