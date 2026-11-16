<!--
  Ⅲ. 강수 과정과 대기의 운동 — 원문
  출처: 손글씨 노트 원본(source/KakaoTalk_..._06.jpg, _07.jpg)을 기준으로 옮김.
  판독이 불확실하거나 내용 확인이 필요한 부분은 docs/REVIEW.md에 정리했습니다.
  ※ {#...} 블록 ID는 필기·문제 연결의 기준입니다. 문장을 고쳐도 ID는 유지하세요.
-->

@chapter atmosphere-01

@row id=atmosphere-01-row widths=1,3
- ① 질소 78% {#atmosphere-01-composition}
- ② 산소 21%
- ③ 이산화 탄소 0.04%
@col
- * 선택적 흡수: 특정 파장의 복사 에너지만 흡수, 나머지 투과 (지표는 거의 다 흡수함!) {#atmosphere-01-absorption}
  - 오존, 산소: 태양 복사 E 中 자외선
  - !!온실 효과!!: <u>수증기, 이산화 탄소</u>: 적외선 — * 지구가 방출하는 E 대부분은 적외선!
  - !!⊕ 메테인, 산화 이질소…!!
  - * 가시광선 → 대기 거의 흡수 X, 지표까지 도달
@end

@figure id=atmosphere-01-fig-spectrum fig=spectrum
(단파장) 자외선 · 가시광선 · 적외선 (장파장): 파장↓ E↑, 파장↑ E↓

[생명 가능 지대]: 별의 주위에서 물(액체)이 존재할 수 있는 거리의 범위 {#atmosphere-01-habitable}

@chapter atmosphere-02

[지구 열수지] (수지 타산! 돈 벌림 생각!): 지구가 태양으로부터 ⊕ 흡수하고 ⊖ 방출하는 에너지의 양 {#atmosphere-02-budget}

빛 → 산란, 반사, 굴절, ::흡수::… 온도로 올림! {#atmosphere-02-light}

@chapter atmosphere-03

#### [단열 변화] {#atmosphere-03-adiabatic}

@row id=atmosphere-03-adiabatic-row widths=1,1
단열 상태에서 ==부피== 변화로 ==온도==가 변하는 현상. 온도가 변하는 정도 → 수증기의 포화 여부에 따라 {#atmosphere-03-adiabatic-def}
@col
- !!단열 팽창!!: 공기 상승 → 팽창 → 내부 E 감소 → 기온 낮아짐 (스프레이) {#atmosphere-03-expansion}
- !!단열 압축!!: 공기 하강 → 압축 → 내부 E 증가 → 기온 높아짐 (자동차 엔진)
@end

#### [단열 감률] {#atmosphere-03-lapse}

- (불포화 상태) !!건조 단열 감률!!: 1 km 상승할 때 기온 10℃ 낮아짐 {#atmosphere-03-lapse-list}
- (포화 상태) !!습윤 단열 감률!!: 〃 5℃ 낮아짐 (수증기가 응결하면서 응결열이 방출되어 기온 덜 내려감)
  - * 수증기 → 물 (응결)
  - * 손난로 액체 → 고체 따뜻!
- * !!이슬점 감률!!: 〃 이슬점이 2℃ 낮아짐 (기온이 낮아지며 수증기압이 낮아지기 때문)

[[단열 변화와 상승 응결 고도·푄 현상|popup:adiabatic]] {#atmosphere-03-lapse-link}

> [이슬점] 상대 습도가 100%에 도달해 수증기가 응결하기 시작할 때의 ==기온== (수증기가 많은 욕실에서는 조금만 차가워져도 물방울 맺힘) (공기가 담긴 상자를 차갑게 만들다 보면 수증기가 물방울로 변하기 시작, 그때의 온도) {#atmosphere-03-dewpoint}

@row id=atmosphere-03-lcl-row widths=1,1
기온 = 이슬점 → (구름)이 생성되기 시작하는 높이 = ::상승 응결 고도:: {#atmosphere-03-lcl}
@col
@figure id=atmosphere-03-fig-foehn fig=foehn popup=adiabatic@3
::푄 현상:: → 고온 건조한 공기 '높새바람'
@end

#### [대기 안정도] {#atmosphere-03-stability}

@row id=atmosphere-03-stability-row widths=3,2
[대기 안정도]: 공기 덩어리가 원래 높이로 되돌아가려고 하는 정도 (안정한 공기! = 역전층 (높이↑ → 기온↑)) {#atmosphere-03-stability-def}

- 절대 안정: 층운형 {#atmosphere-03-stability-list}
- 조건부 불안정: (불포화) 안정, (포화) 불안정
- 절대 불안정: 적운형, 소나기
[[대기 안정도|popup:stability]] {#atmosphere-03-stability-link}
@col
@figure id=atmosphere-03-fig-stability fig=stability-graph popup=stability
높이–온도 그래프: 건조 단열선, 습윤 단열선 → 불안정 · 조건부 · 안정
@end

#### [강수] = 눈, 비 {#atmosphere-03-precip}

- 고위도: ::빙정설:: 구름 상층: −40℃ → 빙정(얼음) + <u>과냉각 물방울</u> ⇒ 과냉각 물방울이 증발해 수증기가 되어 빙정에 달라붙음 ⇒ 눈, 비 {#atmosphere-03-precip-list}
  - 과냉각 물방울: 0℃ 아래에서도 얼지 않고 물방울로 존재. 포화 수증기압이 더 높다 (쉽게 증발한다는 뜻!)
- 저위도: ::병합설:: 구름 0℃ 이상 → 물방울 충돌, 병합 ⇒ 비

@figure id=atmosphere-03-fig-precip fig=precipitation
빙정설(고위도)과 병합설(저위도)

@chapter atmosphere-04

- 기압 경도력: 대기 중 기압 차가 생기면 발생하는 힘 {#atmosphere-04-pgf}
- 연직 기압 경도력: 높이에 따른 기압 차 때문에 생기는 연직(수직) 방향의 기압 경도력 {#atmosphere-04-vertical}
- 정역학 평형: <u>연직 기압 경도력</u>과 <u>중력</u>이 힘의 평형을 이루고 있는 상태 {#atmosphere-04-hydrostatic}
- 전향력: 지구 자전 때문에 발생하는 가상의 힘 (북) 물체 운동 방향의 오른쪽 직각 방향에 작용 (오른쪽!) {#atmosphere-04-coriolis}
- 구심력: 물체가 원운동을 하도록 방향을 바꾸는 ==역할==을 하는 힘, <u>원의 중심 방향으로 작용</u> {#atmosphere-04-centripetal}
- 마찰력: 두 물체가 맞닿은 채 움직일 때 운동 방향과 반대 방향으로 작용하는 힘 {#atmosphere-04-friction}

> [참고] * 1 hPa = 1 m^{2} 면적에 100 N 힘이 작용 / * 1기압 = 1013 hPa = 표준 기압 (해수면에서의 기압) {#atmosphere-04-units}

@chapter atmosphere-05

#### [상층] (1 km 이상 높이) {#atmosphere-05-upper}

@row id=atmosphere-05-geo-row widths=1,1
- 지균풍: <u>등압선이 ::직선::일 때</u> 등압선과 나란히 부는 바람 {#atmosphere-05-geostrophic}
- ① 기압 경도력 생김
- ② 공기 움직이면 전향력 생김
- ③ 점점 휘어짐 ↘
- ④ 기압 경도력 = 전향력 평형 이룰 때까지 → 힘(합력) = 0 ⇒ !!→!!으로 계속 움직임
[[지균풍의 형성|popup:geo-wind]] {#atmosphere-05-geostrophic-link}
@col
@figure id=atmosphere-05-fig-geo fig=geo-wind popup=geo-wind
저(위)·고(아래) 등압선, 기압 경도력 ↑, 전향력 ↓(운동 방향의 오른쪽 직각 방향), !!바람 이동 방향 →!!
@end

- 경도풍: 등압선이 ::원형·곡선::일 때 등압선과 나란하게 원형으로 부는 바람 {#atmosphere-05-gradient}

@row id=atmosphere-05-gradient-row widths=1,1
@figure id=atmosphere-05-fig-low fig=gradient-low popup=gradient-wind
〈저기압〉 !!시계 반대 방향!! (!!진행 방향이 변화!!)
- 기압 경도력 > 전향력 {#atmosphere-05-low}
- (기압 경도력 − 전향력) = 구심력
- → 전향력 = 기압 경도력 − 구심력
@col
@figure id=atmosphere-05-fig-high fig=gradient-high popup=gradient-wind@2
〈고기압〉 !!시계 방향!!
- 전향력 > 기압 경도력 {#atmosphere-05-high}
- (전향력 − 기압 경도력) = 구심력
- → 전향력 = 구심력 + 기압 경도력
- (고) ⇒ 빠름!
@end

#### [지상] 마찰력 有 {#atmosphere-05-surface}

- 지상풍 ← 기압 경도력, 전향력, <u>마찰력</u> {#atmosphere-05-surface-list}
- * ::경각:: : 지상풍이 등압선과 이루는 각 (마찰력 클수록 경각도↑)
[[지상풍과 경각|popup:gradient-wind@3]] {#atmosphere-05-surface-link}

#### [일기도] {#atmosphere-05-map}

- '지상 일기도'의 기압 = 등압선 (등고도면에서 기압이 같은 점을 연결) {#atmosphere-05-map-list}
- '상층 일기도'의 기압 = 등고선 (등압면의 고도가 같은 곳을 연결) 고도 높으면 (고)기압, 고도 (저) → (저)기압

@chapter atmosphere-06

==편서풍 파동==: 중위도 상공에서 발생하는 행성파 (고위도와 저위도의 기온 차 & 전향력 때문) (= 행성파: 회전하는 행성의 대기에 형성되는 거대한 파동) {#atmosphere-06-def}

@row id=atmosphere-06-row widths=1,1
- !!온도↑ 등압면 높아짐 → 기압 경도력!! {#atmosphere-06-pressure}
- !!* 같은 고도일 때 고위도 기압 < 저위도 기압!! ⇒ ==편서풍==: 서쪽에서 불어오는 바람~
@col
- * 제트류: 편서풍에서 속도가 가장 빠른 영역 {#atmosphere-06-jet}
- − 한대 전선 제트류 > 아열대 제트류
@end

#### [대기 대순환] {#atmosphere-06-circulation}

@row id=atmosphere-06-circ-row widths=1,1
- !!태양 상수 = 1367 W!! {#atmosphere-06-solar}
- ↳ 지구가 받는 평균 태양 복사 에너지 = 태양 상수 × 1/4
- 단일 세포 순환 → !!지구 자전 때문에!! ⇒ 3세포 순환 모델
@col
@figure id=atmosphere-06-fig-cells fig=three-cell
0~30° 해들리 순환 · 30~60° 페렐 순환 · 60~90° 극순환
@end

@figure id=atmosphere-06-fig-wave fig=westerly-wave
상층: 기압 마루(고기압성 경도풍, 빠름)와 기압골(저기압성 경도풍, 느림) 사이의 수렴·발산 → 지상: 하강(고기압, 시계)·상승(저기압, 시계 반대) ⇒ 편서풍 따라 이동
