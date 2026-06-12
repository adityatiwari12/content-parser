export type CitationStyle = 'apa' | 'ieee' | 'mla' | 'acm' | 'harvard' | 'chicago'

export type Reference = {
  id: string
  author: string
  title: string
  year: string
  venue: string
  doi: string
  url: string
}

export type CitationIssue = {
  id: string
  severity: 'warning' | 'error'
  message: string
}

export const citationStyles: CitationStyle[] = ['apa', 'ieee', 'mla', 'acm', 'harvard', 'chicago']

export const starterReferences: Reference[] = [
  {
    id: 'ref-vaswani',
    author: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I.',
    title: 'Attention Is All You Need',
    year: '2017',
    venue: 'Advances in Neural Information Processing Systems',
    doi: '10.48550/arXiv.1706.03762',
    url: 'https://arxiv.org/abs/1706.03762',
  },
  {
    id: 'ref-rag',
    author: 'Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D.',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    year: '2020',
    venue: 'Advances in Neural Information Processing Systems',
    doi: '10.48550/arXiv.2005.11401',
    url: 'https://arxiv.org/abs/2005.11401',
  },
  {
    id: 'ref-ai-agents',
    author: 'Kapoor, S., Stroebl, B., Siegel, Z. S., Nadgir, N., & Narayanan, A.',
    title: 'AI Agents That Matter',
    year: '2024',
    venue: 'arXiv preprint',
    doi: '10.48550/arXiv.2407.01502',
    url: 'https://arxiv.org/abs/2407.01502',
  },
]

export const recommendedReferences: Reference[] = [
  {
    id: 'rec-graphrag',
    author: 'Edge, D., Trinh, H., Cheng, N., Bradley, J., Chao, A., Mody, A., Truitt, S., & Larson, J.',
    title: 'From Local to Global: A Graph RAG Approach to Query-Focused Summarization',
    year: '2024',
    venue: 'arXiv preprint',
    doi: '10.48550/arXiv.2404.16130',
    url: 'https://arxiv.org/abs/2404.16130',
  },
  {
    id: 'rec-dspy',
    author: 'Khattab, O., Singhvi, A., Maheshwari, P., Zhang, Z., Santhanam, K., Vardhamanan, S., Haq, S., Sharma, A., Joshi, T. T., Moazam, H., Miller, H., Zaharia, M., & Potts, C.',
    title: 'DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines',
    year: '2023',
    venue: 'arXiv preprint',
    doi: '10.48550/arXiv.2310.03714',
    url: 'https://arxiv.org/abs/2310.03714',
  },
  {
    id: 'rec-survey-rag',
    author: 'Gao, Y., Xiong, Y., Gao, X., Jia, K., Pan, J., Bi, Y., Dai, Y., Sun, J., Wang, M., & Wang, H.',
    title: 'Retrieval-Augmented Generation for Large Language Models: A Survey',
    year: '2024',
    venue: 'arXiv preprint',
    doi: '10.48550/arXiv.2312.10997',
    url: 'https://arxiv.org/abs/2312.10997',
  },
]

function clean(value: string) {
  return value.trim() || 'n.d.'
}

function firstAuthor(value: string) {
  const first = value.split(',')[0]?.trim()
  return first || 'Unknown'
}

export function formatCitation(ref: Reference, style: CitationStyle, index = 1) {
  const author = clean(ref.author)
  const title = clean(ref.title)
  const year = clean(ref.year)
  const venue = clean(ref.venue)
  const doi = ref.doi ? ` https://doi.org/${ref.doi}` : ref.url ? ` ${ref.url}` : ''

  if (style === 'apa') return `${author} (${year}). ${title}. ${venue}.${doi}`
  if (style === 'ieee') return `[${index}] ${author}, "${title}," ${venue}, ${year}.${doi}`
  if (style === 'mla') return `${author}. "${title}." ${venue}, ${year}.${doi}`
  if (style === 'acm') return `${author}. ${year}. ${title}. ${venue}.${doi}`
  if (style === 'harvard') return `${author} ${year}, '${title}', ${venue}.${doi}`
  return `${firstAuthor(author)}, ${title}, ${venue} (${year}).${doi}`
}

export function formatCitations(refs: Reference[], style: CitationStyle) {
  return refs.map((ref, index) => formatCitation(ref, style, index + 1))
}

export function validateReference(ref: Reference): CitationIssue[] {
  const issues: CitationIssue[] = []
  if (!ref.title.trim()) issues.push({ id: `${ref.id}-title`, severity: 'error', message: 'Missing paper title.' })
  if (!ref.author.trim()) issues.push({ id: `${ref.id}-author`, severity: 'error', message: 'Missing author information.' })
  if (!/^\d{4}$/.test(ref.year.trim())) issues.push({ id: `${ref.id}-year`, severity: 'warning', message: 'Year should be four digits.' })
  if (!ref.doi.trim() && !ref.url.trim()) issues.push({ id: `${ref.id}-locator`, severity: 'warning', message: 'Add a DOI or URL for verification.' })
  if (ref.doi && !/^10\.\S+\/\S+/.test(ref.doi)) issues.push({ id: `${ref.id}-doi`, severity: 'warning', message: 'DOI format looks unusual.' })
  return issues
}

export function validateReferences(refs: Reference[]) {
  return refs.flatMap(validateReference)
}

export function toBibTeX(refs: Reference[]) {
  return refs.map((ref, index) => `@article{${ref.id || `ref${index + 1}`},
  title={${ref.title}},
  author={${ref.author}},
  year={${ref.year}},
  journal={${ref.venue}},
  doi={${ref.doi}},
  url={${ref.url}}
}`).join('\n\n')
}

export function toRIS(refs: Reference[]) {
  return refs.map((ref) => `TY  - JOUR
TI  - ${ref.title}
AU  - ${ref.author}
PY  - ${ref.year}
JO  - ${ref.venue}
DO  - ${ref.doi}
UR  - ${ref.url}
ER  -`).join('\n\n')
}
