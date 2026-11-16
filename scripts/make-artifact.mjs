// dist-single/index.html → artifact/moving-earth-science.html
// Artifact 게시 시 문서 골격(doctype/html/head/body)이 자동으로 감싸지므로 제거합니다.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
let html = readFileSync('dist-single/index.html', 'utf8')
html = html
  .replace(/<!doctype html>/i, '')
  .replace(/<\/?html[^>]*>/gi, '')
  .replace(/<\/?head>/gi, '')
  .replace(/<\/?body>/gi, '')
  .replace(/<meta charset="UTF-8" \/>/i, '')
  .replace(/<meta name="viewport"[^>]*>/i, '')
// <title>을 맨 앞으로(게시 도구는 앞 8KB에서 제목을 찾음)
const title = html.match(/<title>.*?<\/title>/)?.[0] ?? ''
html = title + '\n' + html.replace(title, '')
mkdirSync('artifact', { recursive: true })
writeFileSync('artifact/moving-earth-science.html', html.trim() + '\n')
console.log('artifact/moving-earth-science.html', (html.length / 1e6).toFixed(2), 'MB')
