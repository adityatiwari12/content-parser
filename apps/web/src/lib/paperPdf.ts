type Paper = Record<string, string>

const SECTION_LABELS: Record<string, string> = {
  abstract: 'Abstract',
  keywords: 'Keywords',
  introduction: '1. Introduction',
  literatureReview: '2. Literature Review',
  conceptualFramework: '3. Conceptual Framework',
  methodology: '4. Methodology',
  evaluationPlan: '5. Evaluation Plan',
  expectedResults: '6. Expected Results',
  resultsDiscussion: '6. Results and Discussion',
  discussion: '7. Discussion',
  limitations: '8. Limitations',
  conclusion: '9. Conclusion',
  references: 'References',
}

const SECTION_ORDER = [
  'abstract',
  'keywords',
  'introduction',
  'literatureReview',
  'conceptualFramework',
  'methodology',
  'evaluationPlan',
  'expectedResults',
  'resultsDiscussion',
  'discussion',
  'limitations',
  'conclusion',
  'references',
]

type Line = {
  text: string
  size: number
  font: 'regular' | 'bold' | 'italic'
  gapAfter?: number
  align?: 'left' | 'center'
}

function cleanText(value: string) {
  return value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/≥/g, '>=')
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126)
    })
    .join('')
}

function escapePdf(value: string) {
  return cleanText(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function wrapText(text: string, size: number, maxWidth: number) {
  const avgCharWidth = size * 0.5
  const maxChars = Math.max(24, Math.floor(maxWidth / avgCharWidth))
  const words = cleanText(text).split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }

  if (current) lines.push(current)
  return lines
}

function paperToLines(paper: Paper): Line[] {
  const lines: Line[] = []
  const title = paper.title || 'Axiom Lab Research Paper'
  wrapText(title, 18, 455).forEach((line) => lines.push({ text: line, size: 18, font: 'bold', align: 'center' }))
  lines.push({ text: paper.authors || 'Axiom Lab Research Intelligence Group', size: 11, font: 'italic', align: 'center', gapAfter: 10 })

  for (const key of SECTION_ORDER) {
    const value = paper[key]
    if (!value) continue
    lines.push({ text: SECTION_LABELS[key] || key, size: key === 'abstract' ? 12 : 13, font: 'bold', gapAfter: 4 })
    const paragraphs = value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    for (const paragraph of paragraphs) {
      wrapText(paragraph, 10.5, 487).forEach((line) => lines.push({ text: line, size: 10.5, font: key === 'abstract' ? 'italic' : 'regular' }))
      lines.push({ text: '', size: 10.5, font: 'regular', gapAfter: 3 })
    }
    lines.push({ text: '', size: 10.5, font: 'regular', gapAfter: 5 })
  }

  return lines
}

function fontName(font: Line['font']) {
  if (font === 'bold') return 'F2'
  if (font === 'italic') return 'F3'
  return 'F1'
}

function buildPdf(paper: Paper) {
  const pageWidth = 595
  const pageHeight = 842
  const marginX = 54
  const top = 770
  const bottom = 64
  const contentPages: string[] = []
  let commands: string[] = []
  let y = top
  let pageNumber = 1

  function addPageHeader() {
    commands.push('0.1 0.1 0.1 rg')
    commands.push(`BT /F2 9 Tf 1 0 0 1 ${marginX} 805 Tm (AXIOM LAB RESEARCH MANUSCRIPT) Tj ET`)
    commands.push(`BT /F1 9 Tf 1 0 0 1 505 805 Tm (${pageNumber}) Tj ET`)
    commands.push('0.82 0.82 0.82 RG 0.5 w 54 792 m 541 792 l S')
  }

  function pushPage() {
    contentPages.push(commands.join('\n'))
    commands = []
    y = top
    pageNumber += 1
    addPageHeader()
  }

  addPageHeader()
  for (const line of paperToLines(paper)) {
    const lineHeight = line.text ? line.size * 1.35 : line.size + (line.gapAfter || 0)
    if (y - lineHeight < bottom) pushPage()
    if (line.text) {
      const approxWidth = line.text.length * line.size * 0.5
      const x = line.align === 'center' ? Math.max(marginX, (pageWidth - approxWidth) / 2) : marginX
      commands.push(`BT /${fontName(line.font)} ${line.size} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escapePdf(line.text)}) Tj ET`)
    }
    y -= lineHeight + (line.gapAfter || 0)
  }
  contentPages.push(commands.join('\n'))

  const objects: string[] = []
  function addObject(content: string) {
    objects.push(content)
    return objects.length
  }

  const catalogId = addObject('<< /Type /Catalog /Pages 2 0 R >>')
  const pagesId = addObject('')
  const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>')
  const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>')
  const fontItalicId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>')
  const pageIds: number[] = []

  contentPages.forEach((content) => {
    const contentId = addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
    const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R /F3 ${fontItalicId} 0 R >> >> /Contents ${contentId} 0 R >>`)
    pageIds.push(pageId)
  })

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return pdf
}

export function downloadPaperPdf(paper: Paper, filename = 'axiom-research-paper.pdf') {
  const pdf = buildPdf(paper)
  const blob = new Blob([pdf], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function paperWordCount(paper: Paper) {
  return Object.entries(paper)
    .filter(([key]) => key !== 'title' && key !== 'authors')
    .map(([, value]) => value)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
}
