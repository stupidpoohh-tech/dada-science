import { useEffect, useRef } from 'react'
import { closeDialog, useDialog } from '../lib/dialog'

export default function DialogHost() {
  const d = useDialog()
  const ok = useRef<HTMLButtonElement>(null)
  useEffect(() => { if (d) ok.current?.focus() }, [d])
  if (!d) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 p-4" role="dialog" aria-modal="true"
      onKeyDown={(e) => { if (e.key === 'Escape') closeDialog(false) }}>
      <div className="rise w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-[18px] font-extrabold">{d.title}</h2>
        {d.message && <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink/75">{d.message}</p>}
        <div className="mt-5 flex justify-end gap-2">
          {d.cancelLabel && (
            <button type="button" onClick={() => closeDialog(false)} className="no-tap h-11 rounded-xl border border-ink/15 px-4 text-[15px] font-bold">{d.cancelLabel}</button>
          )}
          <button ref={ok} type="button" onClick={() => closeDialog(true)}
            className={`no-tap h-11 rounded-xl px-4 text-[15px] font-bold text-white ${d.danger ? 'bg-coriolis' : 'bg-ink'}`}>{d.confirmLabel ?? '확인'}</button>
        </div>
      </div>
    </div>
  )
}
