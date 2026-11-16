export default function ConceptExplanation({ index, title, text }: { index: number; title: string; text: string }) {
  return (
    <div key={`${index}-${text}`} className="rise min-w-0 flex-1">
      <p className="mb-1 flex items-center gap-2 text-[14px] font-bold text-brand">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-[13px] text-white">{index + 1}</span>
        {title}
      </p>
      <p className="text-[17px] leading-relaxed font-medium text-ink sm:text-[18px]">{text}</p>
    </div>
  )
}
