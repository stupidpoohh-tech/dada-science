<!--
  Ⅱ. 해수의 운동과 순환 — 원문
  출처: 손글씨 노트 원본(source/KakaoTalk_..._04.jpg, _05.jpg)을 기준으로 옮김.
  정리 이미지(.png)와 Word 텍스트에서 손글씨와 다르게 옮겨진 부분은 손글씨를 따랐고,
  판독이 불확실한 부분은 docs/REVIEW.md에 정리했습니다.
  ※ {#...} 블록 ID는 필기·문제 연결의 기준입니다. 문장을 고쳐도 ID는 유지하세요.
  ※ 형식: src/content/manuscripts/README.md
-->

@chapter ocean-01

#### [수직] {#ocean-01-vertical}

@row id=ocean-01-vertical-row widths=3,2
- **수압**(중력) — 무거워… {#ocean-01-pressure}
- 깊어질수록 수압↑ ⇒ 큰 압력(아래) · 작은 압력(위)
- 큰 압력에서 작은 압력으로, 압력 차에 의해 힘이 생김 ⇒ ::수압 경도력::
- 연직 (아래에서 위로) 작용
[[수심에 따른 수압 변화|popup:pressure]] {#ocean-01-pressure-link}
@col
@figure id=ocean-01-fig-hydrostatic fig=hydrostatic width=260
연직 수압 경도력(↑)과 중력(↓)이 평형 → !!정역학 평형!!
@end

#### [수평] {#ocean-01-horizontal}

~ 해수면의 높이 차 or 해수의 밀도 차 {#ocean-01-horizontal-p1}

@row id=ocean-01-horizontal-row widths=1,1
**① 해수면의 높이 차** {#ocean-01-pgf}
@figure id=ocean-01-fig-slope fig=slope popup=pgf
해수면의 경사, 중력 가속도 → !!수평 수압 경도력!!
@col
**② 해수의 밀도 차 ← ==온도==** {#ocean-01-density}
@figure id=ocean-01-fig-density fig=density
더워서 밀도↓ 압력↓ / 추워서 밀도↑ 압력↑ → !!수평 수압 경도력!!(밀도 큰 쪽 → 작은 쪽)
@end

#### [전향력] {#ocean-01-coriolis}

[전향력] = 회전하는 표면 위에서 운동하는 물체에 작용하는, 운동 방향을 휘어지게 하는 가상의 힘 {#ocean-01-coriolis-def}

@row id=ocean-01-coriolis-row widths=1,1
@figure id=ocean-01-fig-coriolis fig=coriolis popup=geostrophic@2
지구 자전 → 북반구와 남반구에서 전향력의 방향
@col
- (북) 물체 운동 방향의 '오른쪽' 직각 방향으로 전향력 작용 {#ocean-01-coriolis-list}
- (남) '왼쪽' 직각 방향으로 전향력 작용
[[북반구·남반구의 전향력 방향|popup:geostrophic@2]] {#ocean-01-coriolis-link}
@end

@chapter ocean-02

#### [에크만 수송] {#ocean-02-ekman}

(북) 바람 —전향력→ 해수는 바람의 **오른쪽 45°** 방향 {#ocean-02-ekman-p1}

@row id=ocean-02-ekman-row widths=3,2
- 심층 해수도 같이 움직이기… {#ocean-02-spiral}
- 근데 마찰 때문에 유속 느려지기…
- 방향이 더더더 꺾이기… ⇒ ::에크만 나선!::
- 에크만층 = 마찰층
- 표면과 해수 이동 방향이 정반대가 되는 깊이 ⇒ !!::마찰 저항 심도::!!
@col
@figure id=ocean-02-fig-ekman thumb=ekman popup=ekman
에크만 나선과 에크만 수송
@end

> [에크만 수송] 에크만층에서 해수의 '평균' 이동 방향 — (북) 풍향의 오른쪽 90°, (남) 풍향의 왼쪽 90° {#ocean-02-ekman-transport}

@popups id=ocean-02-ekman-popups ids=ekman,upwelling

#### (대기 대순환) {#ocean-02-winds}

@row id=ocean-02-winds-row widths=3,2
- 북동 무역풍 … 위도 0~30° → ::서쪽 방향:: {#ocean-02-winds-list}
- 편서풍 … 위도 30~60° → ::동쪽 방향::
- → 지형류
@col
- !!흑조 강하다!! (쿠로시오 해류) {#ocean-02-kuroshio}
- 시계 방향 순환 (바람이 서쪽에서 불어야 ~ 편서풍)
- 표류하면 미국 가!
@end

#### [지형류 형성] {#ocean-02-geostrophic}

에크만 수송 → 해수 이동 → <u>해수면 경사</u> → ::수압 경도력:: 발생 → 해수 움직임 → !!전향력 작용!! (북) 점점 오른쪽으로… ⇒ 등수압선에 <u>나란하게</u> 해수 흐르게 됨 = ==지형류== {#ocean-02-geostrophic-p1}

@row id=ocean-02-geostrophic-row widths=1,1
@figure id=ocean-02-fig-geo1 fig=geo-balance popup=geostrophic
수압 경도력 ←, !!전향력!! → 평형 → !!지형류!!
@col
@figure id=ocean-02-fig-geo2 fig=geo-isobar popup=geostrophic
등수압선 ← 방향 같음! (지형류는 등수압선과 나란하게)
@end

@chapter ocean-03

해파: 해수면의 파동이 퍼지면서 생기는 물 입자의 !!주기!!적인 ==상하== 운동 {#ocean-03-structure}

@row id=ocean-03-structure-row widths=3,2
@figure id=ocean-03-fig-structure fig=wave-structure popup=waves@3
마루, 골, 파고, 파장 / 마루~마루, 골~골 !!시간!! = 주기
@col
$$ id=ocean-03-speed-eq caption="속도 = 파장 / 주기"
속도 = 파장 / 주기
$$
- 물 입자는 그대로 제자리! {#ocean-03-particle}
- 이동 X, E만 전달!
[[파동의 진행과 물 입자 운동|popup:waves]] {#ocean-03-particle-link}
@end

#### [모양] {#ocean-03-shape}

@row id=ocean-03-shape-row widths=2,3
@figure id=ocean-03-fig-shapes fig=wave-shapes
풍랑 · 너울 · 연안 쇄파 (그림으로 기억!)
@col
- 풍랑: 마루가 뾰족 (바람 부는 해역 → 풍역대) 방향 일정 {#ocean-03-shape-list}
- 너울: 마루가 둥글, 긴 파장
- 연안 쇄파: (수심 얕아져) 느린 속도, 짧은 파장, 높은 파고 → 부서짐.
[[해안 접근에 따른 파속·파장·파고 변화|popup:shoaling]] {#ocean-03-shoaling}
@end

#### [파장과 수심의 비교] {#ocean-03-types}

@figure id=ocean-03-fig-types fig=wave-types popup=waves@4
심해파 · 천이파 · 천해파: 깊다 ← 수심이 파장의 1/2보다 → 얕다

@table id=ocean-03-tbl-types
| 구분 | 물 입자 | 깊은 곳 | 속도를 결정하는 것 |
|---|---|---|---|
| 심해파 | 원운동 | 작아져 무시 | 파장 (파장↑ 속도↑) |
| 천이파 | 중간 | | |
| 천해파 | 타원 운동, 수평 왕복 운동 | | 수심 (수심의 제곱근에 비례, 얕을수록 느려짐. 파고는 높아짐) |

@row id=ocean-03-refraction-row widths=1,1
@figure id=ocean-03-fig-refraction fig=refraction
만: 퇴적(모래사장) · 곶: 침식(절벽)
@col
- 수심의 변화가 큼 → 해파 진행 속도 차이가 큼 {#ocean-03-refraction-list}
- 해파는 곶으로 ::굴절::
@end

@chapter ocean-04

#### 폭풍 해일 {#ocean-04-storm}

@row id=ocean-04-storm-row widths=2,3
@figure id=ocean-04-fig-storm fig=storm-pressure popup=storm-surge
고기압 ↓ 해수면 낮아짐 / 저기압(태풍) ↑ 해수면 높아짐
@col
- ==고기압== → 해수면 낮아짐, ==저기압==(태풍) → 해수면 높아짐 {#ocean-04-storm-list}
- 해면 기압 1 hPa 낮아지면 해수면 1 cm 높아짐
[[폭풍 해일의 발생 과정|popup:storm-surge]] {#ocean-04-storm-link}
@end

#### 지진 해일 = 쓰나미 {#ocean-04-tsunami}

- 파장이 100~200 km로 매우 길다 {#ocean-04-tsunami-list}
- (* 대양 평균 수심은 4 km) ⇒ <u>천해파</u>
- 매우 빠르다 → 느려지면서 파장 짧아지고 파고 ↑↑

@figure id=ocean-04-fig-tsunami thumb=tsunami popup=tsunami
해저 지진에 의한 지진 해일의 발생과 해안 접근

@chapter ocean-05

==조석== = 주기적으로 해수면의 높이가 <u>높아졌다</u> <u>낮아지는</u> 현상 {#ocean-05-tide}

@row id=ocean-05-tide-row widths=1,1
- 하루 中 ==만조==(고조) → ==간조==(저조): 썰물 {#ocean-05-day}
- 간조 → 만조: 밀물
- ::흐름 → 조류::
- ::높이 차 → 조차::
[[하루 동안의 조석과 조류|popup:tide-day]] {#ocean-05-day-link}
@col
@figure id=ocean-05-fig-phase fig=moon-phase popup=tides
조금(소조): 상현·하현 / 사리(대조): 삭·망 → 조차 가장 클 때
@end

#### [기조력] {#ocean-05-force}

[기조력] = 조석을 일으키는 힘 {#ocean-05-force-def}

@row id=ocean-05-force-row widths=3,2
- <u>'지구 원운동 원심력'</u> + <u>'달이 지구에 작용하는 인력'</u>의 합력 {#ocean-05-force-list}
- 원심력: 달에서 멀어지는 방향 / 인력: 달을 향한 방향
- → 달에서 가장 가까운 쪽 + 가장 먼 쪽 모두 가장 높아짐
- !!* 태양은 멀어서 달 기조력의 1/2!! {#ocean-05-spring}
[[달의 위치와 사리·조금|popup:tides]] {#ocean-05-spring-link}
@col
@figure id=ocean-05-fig-force fig=tide-force popup=tides
지구 ← 멀어 · 가까워 → 달
@end

- 자전하니까 하루에 만조, 간조 나타남 {#ocean-05-period-list}
- 그런데! 자전하는 동안 달도 공전(6.5°)해서 이동. !!지구가 더 25분 자전해야!! ⇒ 주기 = 12시간 25분
- 적도가 기울어져 있어서 실제 조석은 매우 복잡!
