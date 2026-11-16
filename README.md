# 움직이는 지구과학 — 인터랙티브 디지털 교과서

고등학교 지구과학 내신 학습용 웹 교재입니다.

**원문 학습 → 움직이는 그림(팝업) → 개념 확인 → 학습 완료 → 기본 예제 → 내신 대비 → 오답 복습**

- **원본 학습지 배치 재현**: 손글씨 노트의 대제목·소제목·괄호 소제목·그림·화살표 위치를 행 단위 SVG로 다시 그렸습니다(`src/sheets/`). 글자는 SVG 텍스트라 선택·복사가 되고, 움직이는 그림이 연결된 그림에만 작은 ▶ 표시가 붙습니다. 학습지는 A4 폭(794 논리 px)으로 배치한 뒤 화면에 맞춰 확대·축소하며(왼쪽 아래 −/＋/맞춤), 필기 좌표는 배율과 관계없이 유지됩니다.
- 대단원마다 **한 장의 연속된 교재**: 소챕터는 제목·번호·구분선으로만 나뉘고 스크롤로 이어집니다. 왼쪽 목차(가로 화면)가 현재 읽는 소챕터를 자동 강조하고, 세로·휴대폰의 위쪽 바는 대단원 이름과 ‹ › 대단원 이동 버튼을 보여 줍니다. 처음 접속하면 첫 대단원 교재가 바로 열립니다.
- 원문의 그림·용어 중 **재생 표시가 있는 것만** 누르면 단계별 움직이는 그림이 열리고, 닫으면 읽던 위치로 돌아옵니다. 마지막 단계의 확인 문제를 맞히면 그 개념이 학습 완료됩니다.
- **필기**: 펜·형광펜·레이저 포인터·지우개, 실행 취소·다시 실행, 색·굵기, 표시/숨기기, 백업 내보내기·가져오기. 자동 저장(IndexedDB).
- **문제은행**: 개념 확인 문제(모두 푼 뒤 전체 채점), 내신 대비(시험 모드 → 제출 후 일괄 채점). 용어·핵심 값을 묻는 문항은 단답형, 설명을 요구하던 서술형은 객관식, 오답 노트(자동 등록·다시 풀기·재풀이 기록). 정답·해설 펼치기/접기, 오답·미응답 다시 풀기, 개념별 정답률을 제공합니다. 해설의 개념 링크는 원문의 정확한 위치로 이동해 강조하고, 관련 움직이는 그림과 ‘문제로 돌아가기’를 제공합니다.

## 현재 콘텐츠 상태

| 대단원 | 원문 | 움직이는 그림 | 개념 확인 문제 | 내신 대비 |
|---|---|---|---|---|
| Ⅱ. 해수의 운동과 순환 | 손글씨 노트에서 옮김(5개 소챕터) | 7개 | C01~C25 (25문항, 100점) | E01~E25 (객관식 25, 100점) |
| Ⅲ. 강수 과정과 대기의 운동 | 손글씨 노트에서 옮김(6개 소챕터) | 4개 | Q01~Q30 (30문항, 정답률) | 1~25번 (객관식 25, 100점) |

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
| 원문 순서(학습지 행 배열) | `src/content/manuscripts/<단원>.md` (`@chapter`, `@sheet id=…`) |
| 학습지 행(글·그림·배치) | `src/sheets/<단원>.tsx` — 부품: `src/sheets/primitives.tsx`(Txt, Boxed, Circled, Arw, Curve, Wave, Cloud, Hot) |
| 일반 원문(학습지 배치가 없는 단원) | 같은 원문 파일에 Markdown 문법(형식: 같은 폴더의 `README.md`) |
| 대단원·소챕터 추가, 학습 완료 조건 | `src/content/units.ts` (`completion: { type: 'manual' }`이면 소챕터 끝의 체크로 완료) |
| 개념(문제 ↔ 원문 ↔ 팝업 연결) | `src/content/concepts.ts` |
| 문제 입력 | `src/content/questions/<단원>.ts` |
| 팝업 단계 설명·확인 문제 | `src/content/popups.ts` |
| 팝업 그림 추가 | `src/scenes/`에 컴포넌트를 만들고 `src/scenes/index.ts`에 등록 |
| 원문 정적 그림 | `src/figures/index.tsx` (`@figure fig=키`) |

### 문제은행

- 문제: `src/content/bank/<단원>.questions.ts` (문제·선택지·소주제·난이도·배점·관련 개념)
- 정답·해설: `src/content/bank/<단원>.answers.ts` (원본 코드 C01·E01·Q01로 연결, 화면은 채점 후에만 읽음)
- 소주제(개념 분류)와 연결 소챕터: 각 questions 파일의 `*_TOPICS`
- 문항 식별자(`code`)와 `id`는 바꾸지 마세요(학습 기록·오답 노트가 연결됨).
- 무결성 검사: `npm run check:bank` (문항 수·배점 합·정답 번호·빈칸 수·채점 기준 합)

```ts
// 문제
{ code: 'C26', topic: 'waves', type: 'blank', difficulty: '하', question: '…(      )…', conceptIds: ['ocean.wave-structure'] }
// 정답(칸마다 [정답, 허용 답…])
C26: { answer: [['파장', '파장 길이']], display: '파장', explanation: '…' }
// 서술형
E26: { manual: true, answer: '', display: '모범답안 참고', modelAnswer: '…', rubric: [{ text: '…', points: 2 }, { text: '…', points: 2 }] }
```

## 구조

```
src/
├─ content/            단원·원문·개념·팝업 데이터, bank/(문제은행: 문제와 정답 분리)
├─ lib/                원문 파서, 진도 저장(localStorage, 버전·이전 기록 변환), 필기 저장(IndexedDB), 라우터
├─ components/
│  ├─ textbook/        UnitPage(AppShell), ChapterNavigation, ContinuousTextbook, ConceptBlock, InteractiveFigure, PageScaler
│  ├─ popup/           ConceptPopup (SceneViewer, StepControls, ConceptQuiz 재사용)
│  ├─ annotation/      AnnotationSurface(필기 레이어·펜·형광펜·레이저·지우개), AnnotationToolbar
│  └─ assessment/      QuestionSetPage(개념 확인·내신 대비·결과), BankQuestionCard(유형별 입력), WrongAnswerNotebook
├─ scenes/             움직이는 그림(SVG) 11종
└─ figures/            원문 정적 그림(SVG)
```

## 필기의 동작 방식

- **입력 구분**: 필기 도구를 고르면 Apple Pencil·마우스는 필기, 손가락은 스크롤과 버튼 조작입니다. iPadOS Safari에서는 펜 터치(`touchType: 'stylus'`)만 스크롤을 막습니다. 펜이 없는 기기는 도구 모음 ‘더 보기 → 손가락으로도 필기’를 켭니다(켜 있는 동안은 손가락 스크롤이 멈춤). 손 모양 버튼(탐색)을 누르면 필기가 꺼집니다.
- **그림과의 충돌 방지**: 필기 획이 시작된 입력의 클릭은 막으므로, 그림 위에 동그라미를 그려도 팝업이 열리지 않습니다. 팝업 안에서는 ‘그림에 필기’를 켤 때만 필기되고, 그동안 그림 조작은 멈춥니다.
- **위치 보존**: 획은 화면 좌표가 아니라 원문 블록(`data-block-id`) 기준 좌표로 저장됩니다. 본문은 고정 판형(720 논리 px)을 화면에 맞게 확대·축소하므로 화면 크기가 바뀌어도 줄바꿈이 같아 필기가 글자 위에 그대로 있습니다. 폭 600px 미만 휴대폰에서는 읽기 위해 줄바꿈을 다시 하므로 필기는 블록 비율로 맞춘 근사 위치에 표시됩니다.
- **저장**: 대단원별·팝업별로 IndexedDB에 자동 저장됩니다. 이 기기의 브라우저에만 남으며 다른 기기와 동기화되지 않습니다. ‘필기 백업 파일 내보내기’로 JSON 파일을 받아 두고, ‘가져오기’로 합칠 수 있습니다.

## 검증

자동 테스트(Playwright, 데스크톱 Chromium)로 확인한 항목과 실제 기기에서 확인할 항목은 [`docs/TESTING.md`](docs/TESTING.md)에 있습니다.
