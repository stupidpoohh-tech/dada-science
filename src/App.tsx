import { unitById } from './content/units'
import { useRoute } from './lib/router'
import Home from './components/Home'
import UnitPage from './components/textbook/UnitPage'
import QuestionSetPage from './components/assessment/QuestionSetPage'
import WrongAnswerNotebook from './components/assessment/WrongAnswerNotebook'
import ConceptPopupHost from './components/popup/ConceptPopup'
import AnnotationToolbar from './components/annotation/AnnotationToolbar'
import DialogHost from './components/DialogHost'

export default function App() {
  const route = useRoute()
  const unit = route.name !== 'home' ? unitById(route.unitId) : undefined
  let page
  if (route.name === 'home' || !unit) page = <Home />
  else if (route.name === 'unit') page = <UnitPage key={unit.id} unit={unit} focus={route.focus} back={route.back} concept={route.concept} />
  else if (route.name === 'concept' || route.name === 'exam') page = <QuestionSetPage key={`${unit.id}-${route.name}`} unit={unit} set={route.name} topic={route.topic} q={route.q} />
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
