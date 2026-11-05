export function trigrams(text: string): Set<string> {
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  return new Set(words.flatMap(word => {
    const padded = `  ${word} `
    return Array.from({ length: padded.length - 2 }, (_, i) => padded.slice(i, i + 3))
  }))
}
export function similarity(a: string, b: string): number {
  const left = trigrams(a), right = trigrams(b)
  const common = [...left].filter(t => right.has(t)).length
  const union = left.size + right.size - common
  return union ? common / union : 0
}
export function wordSimilarity(query: string, text: string): number {
  return Math.max(0, ...(text.match(/[\p{L}\p{N}]+/gu) ?? []).map(word => similarity(query, word)))
}
