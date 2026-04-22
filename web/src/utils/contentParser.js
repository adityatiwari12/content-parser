const mockSources = [
  {
    title: 'Journal on Applied AI Policy',
    domain: 'doi.org/mock-ai-policy',
    text: 'Methodological rigor and transparent reporting are key requirements in policy research and evaluation frameworks.',
  },
  {
    title: 'Open Research Archive',
    domain: 'openarchive.org/research-methods',
    text: 'Interdisciplinary approaches are increasingly required for complex socio-technical systems and public governance.',
  },
  {
    title: 'Education and Technology Review',
    domain: 'edtechreview.example/ethics',
    text: 'Reproducibility concerns remain a central issue in modern academic publishing and experimental studies.',
  },
  {
    title: 'Systems Design Conference Notes',
    domain: 'conference-notes.example/systems',
    text: 'Context-aware models are more robust than fixed universal models when applied in heterogeneous settings.',
  },
]

export function parseContent(text) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean)
  const paragraphs = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgWordsPerSentence: sentences.length ? Math.round(words.length / sentences.length) : 0,
    readingTimeMin: Math.max(1, Math.ceil(words.length / 200)),
    keyPhrases: topKeyPhrases(text),
  }
}

function topKeyPhrases(text) {
  const stopWords = new Set([
    'the', 'and', 'or', 'of', 'to', 'in', 'a', 'is', 'for', 'with', 'on', 'that',
    'this', 'by', 'as', 'an', 'are', 'be', 'from', 'at', 'it', 'can', 'has', 'have',
  ])
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && !stopWords.has(token) && token.length > 3)

  const frequency = new Map()
  tokens.forEach((token) => frequency.set(token, (frequency.get(token) || 0) + 1))

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([keyword, count]) => `${keyword} (${count})`)
}

export function runPlagiarismCheck(text) {
  const inputSentences = text
    .split(/[.!?]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 25)

  const matches = []
  let maxSimilarity = 0

  inputSentences.forEach((sentence) => {
    mockSources.forEach((source) => {
      const similarity = sentenceSimilarity(sentence, source.text)
      if (similarity >= 0.34) {
        matches.push({
          sentence,
          sourceTitle: source.title,
          sourceDomain: source.domain,
          similarity: Math.round(similarity * 100),
        })
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity
        }
      }
    })
  })

  const uniqueMatched = new Set(matches.map((match) => match.sentence)).size
  const sentenceBase = inputSentences.length || 1
  const plagiarismScore = Math.min(95, Math.round((uniqueMatched / sentenceBase) * 100))

  return {
    score: plagiarismScore,
    riskLevel: plagiarismScore > 45 ? 'High' : plagiarismScore > 20 ? 'Medium' : 'Low',
    highestSentenceSimilarity: Math.round(maxSimilarity * 100),
    matches,
  }
}

function sentenceSimilarity(a, b) {
  const setA = new Set(normalize(a))
  const setB = new Set(normalize(b))
  const intersection = [...setA].filter((token) => setB.has(token)).length
  const union = new Set([...setA, ...setB]).size
  if (union === 0) return 0
  return intersection / union
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}
