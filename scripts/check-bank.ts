// 문제은행 검증: npm run check:bank
import { BANK, answerKeyOf, validateBank } from '../src/content/bank/index.ts'
import { gradeItem } from '../src/lib/bankGrading.ts'

const errs = validateBank()
let pass = 0
for (const q of BANK) {
  const k = answerKeyOf(q)!
  if (k.manual) { pass++; continue }
  const right = q.type === 'multiple_choice' || q.type === 'ox' ? k.answer : (k.answer as string[][]).map((a) => a[0])
  if (gradeItem(q, k, right as never).status === 'correct') pass++
  else errs.push(`${q.id}: 등록된 정답으로 채점했는데 정답 처리되지 않음`)
}
const by = (u: string, s: string) => BANK.filter((q) => q.unitId === u && q.set === s).length
console.log(`해수 개념 확인 ${by('ocean', 'concept')} · 내신 ${by('ocean', 'exam')} / 대기 개념 확인 ${by('atmosphere', 'concept')} · 내신 ${by('atmosphere', 'exam')} / 총 ${BANK.length}문항`)
console.log(`정답 연결·자동 채점 확인 ${pass}/${BANK.length}`)
if (errs.length) { console.error(errs.join('\n')); process.exit(1) }
console.log('문제은행 검사 통과')
