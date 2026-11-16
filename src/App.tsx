import { UNITS, unitById } from './content/units'
import { useRoute } from './lib/router'
import UnitPage from './components/textbook/UnitPage'
import QuestionSetPage from './components/assessment/QuestionSetPage'
import WrongAnswerNotebook from './components/assessment/WrongAnswerNotebook'
import ConceptPopupHost from './components/popup/ConceptPopup'
import AnnotationToolbar from './components/annotation/AnnotationToolbar'
import DialogHost from './components/DialogHost'

export default function App() {
  const route = useRoute()
  // 처음 화면(#/)은 첫 대단원 교재를 바로 펼칩니다.
  const unit = (route.name !== 'home' ? unitById(route.unitId) : undefined) ?? UNITS[0]
  let page
  if (route.name === 'home' || route.name === 'unit') page = <UnitPage key={unit.id} unit={unit} focus={route.name === 'unit' ? route.focus : undefined} back={route.name === 'unit' ? route.back : undefined} concept={route.name === 'unit' ? route.concept : undefined} />
  else if (route.name === 'concept' || route.name === 'exam' || route.name === 'textbook') page = <QuestionSetPage key={`${unit.id}-${route.name}`} unit={unit} set={route.name} topic={route.topic} q={route.q} />
  else page = <WrongAnswerNotebook key={unit.id} unit={unit} />
  return (
    <>
      {page}
      <ConceptPopupHost />
      <AnnotationToolbar />
      <DialogHost />
    </>
  )
}
