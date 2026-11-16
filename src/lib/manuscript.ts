/**
 * 원문 Markdown 파서.
 * 형식 설명: src/content/manuscripts/README.md
 */

export type Block =
  | { kind: 'heading'; id: string; level: 3 | 4; text: string }
  | { kind: 'para'; id: string; text: string }
  | { kind: 'box'; id: string; label?: string; text: string }
  | { kind: 'formula'; id: string; text: string; caption?: string }
  | { kind: 'figure'; id: string; caption: string; src?: string; thumb?: string; fig?: string; popup?: string; popupStep?: number; alt?: string; width?: number }
  | { kind: 'table'; id: string; caption?: string; header: string[]; rows: string[][] }
  | { kind: 'placeholder'; id: string; text: string }
  | { kind: 'demo'; id: string; text: string }
  /** 글머리 목록. depth 0~2 */
  | { kind: 'list'; id: string; items: { text: string; depth: number; id?: string }[] }
  /** 좌우 배치(원문 노트의 배치를 따름) */
  | { kind: 'row'; id: string; cols: Block[][]; widths?: number[] }
  /** 관련 팝업 바로가기 줄 */
  | { kind: 'popups'; id: string; popups: { id: string; step?: number }[] }

export interface ParsedChapter { chapterId: string; blocks: Block[] }
export interface ParsedManuscript { chapters: ParsedChapter[]; warnings: string[]; blockIndex: Map<string, { chapterId: string; block: Block }> }

const ID_RE = /\s*\{#([A-Za-z0-9_.-]+)\}\s*$/

function parseAttrs(s: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /([a-zA-Z]+)=(?:"([^"]*)"|(\S+))/g
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) out[m[1]] = m[2] ?? m[3]
  return out
}

function takeId(line: string): [string, string | undefined] {
  const m = line.match(ID_RE)
  return m ? [line.replace(ID_RE, ''), m[1]] : [line, undefined]
}

export function parseManuscript(src: string): ParsedManuscript {
  const lines = src.replace(/\r\n/g, '\n').split('\n')
  const chapters: ParsedChapter[] = []
  const warnings: string[] = []
  const blockIndex = new Map<string, { chapterId: string; block: Block }>()
  let cur: ParsedChapter | null = null
  let auto = 0

  const rowStack: Block[] = []
  const push = (b: Block) => {
    if (!cur) { warnings.push(`@chapter 앞에 있는 블록은 무시됩니다: ${b.id}`); return }
    const row = rowStack[rowStack.length - 1]
    if (row && row.kind === 'row' && b !== row) {
      row.cols[row.cols.length - 1].push(b)
      if (blockIndex.has(b.id)) warnings.push(`중복 ID: ${b.id}`)
      blockIndex.set(b.id, { chapterId: cur.chapterId, block: b })
      return
    }
    if (blockIndex.has(b.id)) warnings.push(`중복 ID: ${b.id}`)
    cur.blocks.push(b)
    blockIndex.set(b.id, { chapterId: cur.chapterId, block: b })
  }
  const autoId = (kind: string) => {
    const id = `${cur?.chapterId ?? 'x'}-${kind}${++auto}`
    warnings.push(`ID가 없는 블록에 임시 ID를 붙였습니다(필기·문제 연결이 바뀔 수 있음): ${id}`)
    return id
  }

  let i = 0
  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()
    if (!line || line.startsWith('<!--')) {
      if (line.startsWith('<!--')) while (i < lines.length && !lines[i].includes('-->')) i++
      i++; continue
    }
    if (line.startsWith('@chapter')) {
      const id = line.slice(8).trim()
      cur = { chapterId: id, blocks: [] }
      chapters.push(cur)
      auto = 0
      i++; continue
    }
    if (line.startsWith('#### ') || line.startsWith('### ')) {
      const level = line.startsWith('####') ? 4 : 3
      const [text, id] = takeId(line.replace(/^#+\s*/, ''))
      push({ kind: 'heading', level, id: id ?? autoId('h'), text })
      i++; continue
    }
    if (line.startsWith('@figure')) {
      const a = parseAttrs(line)
      const cap: string[] = []
      i++
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('@') && !/^\s*- /.test(lines[i])) cap.push(lines[i++].trim())
      const [popup, step] = (a.popup ?? '').split('@')
      push({ kind: 'figure', id: a.id ?? autoId('fig'), src: a.src, thumb: a.thumb, fig: a.fig, alt: a.alt, width: a.width ? Number(a.width) : undefined, popup: popup || undefined, popupStep: step ? Number(step) : undefined, caption: cap.join(' ') })
      continue
    }
    if (line.startsWith('@row')) {
      const a = parseAttrs(line)
      const row: Block = { kind: 'row', id: a.id ?? autoId('row'), cols: [[]], widths: a.widths ? a.widths.split(',').map(Number) : undefined }
      rowStack.push(row)
      i++; continue
    }
    if (line === '@col') {
      const row = rowStack[rowStack.length - 1]
      if (row && row.kind === 'row') row.cols.push([])
      i++; continue
    }
    if (line === '@end') {
      const row = rowStack.pop()
      if (row) push(row)
      i++; continue
    }
    if (line.startsWith('@popups')) {
      const a = parseAttrs(line)
      const ids = (a.ids ?? '').split(',').filter(Boolean).map((x) => { const [id, st] = x.split('@'); return { id, step: st ? Number(st) : undefined } })
      push({ kind: 'popups', id: a.id ?? autoId('pop'), popups: ids })
      i++; continue
    }
    if (/^(\s*)- /.test(raw)) {
      const items: { text: string; depth: number; id?: string }[] = []
      let id: string | undefined
      while (i < lines.length && /^(\s*)- /.test(lines[i])) {
        const m = lines[i].match(/^(\s*)- (.*)$/)!
        const [t, bid] = takeId(m[2])
        if (bid && !id) id = bid
        items.push({ text: t, depth: Math.min(2, Math.floor(m[1].length / 2)), id: bid && bid !== id ? bid : undefined })
        i++
      }
      push({ kind: 'list', id: id ?? autoId('ul'), items })
      continue
    }
    if (line.startsWith('@table')) {
      const a = parseAttrs(line)
      i++
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells)
        i++
      }
      push({ kind: 'table', id: a.id ?? autoId('tbl'), caption: a.caption, header: rows[0] ?? [], rows: rows.slice(1) })
      continue
    }
    if (line.startsWith('$$')) {
      const a = parseAttrs(line.slice(2))
      const body: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('$$')) body.push(lines[i++].trim())
      i++
      push({ kind: 'formula', id: a.id ?? autoId('eq'), caption: a.caption, text: body.join(' ') })
      continue
    }
    if (line.startsWith('@todo') || line.startsWith('@demo')) {
      const kind = line.startsWith('@todo') ? 'placeholder' : 'demo'
      const a = parseAttrs(line)
      const body: string[] = []
      i++
      while (i < lines.length && lines[i].trim()) body.push(lines[i++].trim())
      push({ kind, id: a.id ?? autoId(kind), text: body.join(' ') } as Block)
      continue
    }
    if (line.startsWith('>')) {
      const body: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) body.push(lines[i++].trim().replace(/^>\s?/, ''))
      let text = body.join(' ')
      let label: string | undefined
      const lm = text.match(/^\[([^\]]+)\]\s*/)
      if (lm) { label = lm[1]; text = text.slice(lm[0].length) }
      const [t, id] = takeId(text)
      push({ kind: 'box', id: id ?? autoId('box'), label, text: t })
      continue
    }
    // 문단: 빈 줄이나 다른 블록 시작 전까지
    const body: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(@|#{3,4} |>|\$\$)/.test(lines[i].trim()) && !/^(\s*)- /.test(lines[i])) body.push(lines[i++].trim())
    const [t, id] = takeId(body.join(' '))
    push({ kind: 'para', id: id ?? autoId('p'), text: t })
  }
  return { chapters, warnings, blockIndex }
}

// ───────── 인라인 문법 ─────────
export type Inline =
  | { t: 'text'; v: string }
  | { t: 'b'; v: Inline[] }
  | { t: 'i'; v: Inline[] }
  | { t: 'term'; v: Inline[] }
  | { t: 'sup' | 'sub'; v: string }
  | { t: 'link'; label: string; target: string }
  | { t: 'red'; v: Inline[] }
  | { t: 'u'; v: Inline[] }
  | { t: 'box'; v: Inline[] }

const INLINE_RE = /\*\*(.+?)\*\*|==(.+?)==|\[\[([^|\]]+)\|([^\]]+)\]\]|\^\{([^}]*)\}|_\{([^}]*)\}|!!(.+?)!!|::(.+?)::|<u>(.+?)<\/u>/g

export function parseInline(s: string): Inline[] {
  const out: Inline[] = []
  let last = 0
  let m: RegExpExecArray | null
  INLINE_RE.lastIndex = 0
  const re = new RegExp(INLINE_RE.source, 'g')
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ t: 'text', v: s.slice(last, m.index) })
    if (m[1] !== undefined) out.push({ t: 'b', v: parseInline(m[1]) })
    else if (m[2] !== undefined) out.push({ t: 'term', v: parseInline(m[2]) })
    else if (m[3] !== undefined) out.push({ t: 'link', label: m[3], target: m[4] })
    else if (m[5] !== undefined) out.push({ t: 'sup', v: m[5] })
    else if (m[6] !== undefined) out.push({ t: 'sub', v: m[6] })
    else if (m[7] !== undefined) out.push({ t: 'red', v: parseInline(m[7]) })
    else if (m[8] !== undefined) out.push({ t: 'box', v: parseInline(m[8]) })
    else if (m[9] !== undefined) out.push({ t: 'u', v: parseInline(m[9]) })
    last = re.lastIndex
  }
  if (last < s.length) out.push({ t: 'text', v: s.slice(last) })
  return out
}

/** 'popup:ekman@2' → { popup: 'ekman', step: 2 } / '#ocean-02-ekman' → { anchor } */
export function parseTarget(target: string): { popup?: string; step?: number; anchor?: string } {
  if (target.startsWith('popup:')) {
    const [p, s] = target.slice(6).split('@')
    return { popup: p, step: s ? Number(s) : undefined }
  }
  if (target.startsWith('#')) return { anchor: target.slice(1) }
  return {}
}
