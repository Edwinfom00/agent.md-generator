export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  text: string
  oldLineNo?: number
  newLineNo?: number
}

export interface DiffHunk {
  oldStart: number
  oldLength: number
  newStart: number
  newLength: number
  lines: DiffLine[]
}

export function computeLineDiff(oldStr: string, newStr: string): DiffLine[] {
  const oldLines = oldStr.split(/\r?\n/)
  const newLines = newStr.split(/\r?\n/)

  const oldLen = oldLines.length
  const newLen = newLines.length

  const dp: number[][] = Array(oldLen + 1)
    .fill(null)
    .map(() => Array(newLen + 1).fill(0))

  for (let i = 1; i <= oldLen; i++) {
    for (let j = 1; j <= newLen; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const diff: DiffLine[] = []
  let i = oldLen
  let j = newLen

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      diff.unshift({ type: 'unchanged', text: oldLines[i - 1], oldLineNo: i, newLineNo: j })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: 'added', text: newLines[j - 1], newLineNo: j })
      j--
    } else {
      diff.unshift({ type: 'removed', text: oldLines[i - 1], oldLineNo: i })
      i--
    }
  }

  return diff
}

export function getDiffHunks(diffLines: DiffLine[], contextSize: number = 3): DiffHunk[] {
  const hunks: DiffHunk[] = []
  let currentHunkLines: DiffLine[] = []

  let i = 0
  const total = diffLines.length

  while (i < total) {
    const line = diffLines[i]
    const isChange = line.type === 'added' || line.type === 'removed'

    if (isChange) {
      let backCount = 0
      const contextBefore: DiffLine[] = []
      let k = i - 1
      while (k >= 0 && backCount < contextSize) {
        if (diffLines[k].type === 'unchanged') {
          contextBefore.unshift(diffLines[k])
          backCount++
        } else {
          break
        }
        k--
      }

      if (hunks.length > 0) {
        const lastHunk = hunks[hunks.length - 1]
        const lastLineInLastHunk = lastHunk.lines[lastHunk.lines.length - 1]
        const firstLineInContext = contextBefore[0] || line
        const lastOldNo = lastLineInLastHunk.oldLineNo || lastLineInLastHunk.newLineNo || 0
        const firstOldNo = firstLineInContext.oldLineNo || firstLineInContext.newLineNo || 0

        if (firstOldNo - lastOldNo <= contextSize * 2) {
          hunks.pop()
          const startIdx = diffLines.indexOf(lastLineInLastHunk) + 1
          const endIdx = diffLines.indexOf(line)
          for (let m = startIdx; m < endIdx; m++) {
            lastHunk.lines.push(diffLines[m])
          }
          currentHunkLines = lastHunk.lines
        } else {
          currentHunkLines = [...contextBefore]
        }
      } else {
        currentHunkLines = [...contextBefore]
      }

      currentHunkLines.push(line)

      i++
      let unchangedStreak = 0
      while (i < total) {
        const nextLine = diffLines[i]
        const isNextChange = nextLine.type === 'added' || nextLine.type === 'removed'

        if (isNextChange) {
          unchangedStreak = 0
          currentHunkLines.push(nextLine)
        } else {
          unchangedStreak++
          currentHunkLines.push(nextLine)
          if (unchangedStreak >= contextSize) break
        }
        i++
      }

      const hunkAdded = currentHunkLines.filter(l => l.type === 'added')
      const hunkRemoved = currentHunkLines.filter(l => l.type === 'removed')
      const hunkUnchanged = currentHunkLines.filter(l => l.type === 'unchanged')

      const oldStart = currentHunkLines.find(l => l.oldLineNo !== undefined)?.oldLineNo ?? 1
      const newStart = currentHunkLines.find(l => l.newLineNo !== undefined)?.newLineNo ?? 1
      const oldLength = hunkRemoved.length + hunkUnchanged.length
      const newLength = hunkAdded.length + hunkUnchanged.length

      hunks.push({ oldStart, oldLength, newStart, newLength, lines: [...currentHunkLines] })
    } else {
      i++
    }
  }

  return hunks
}
