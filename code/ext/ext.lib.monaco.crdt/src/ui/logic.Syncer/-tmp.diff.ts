interface EditorPatch {
  action: 'insert' | 'delete' | 'replace' | 'splice';
  lineNumber: number;
  index?: number; // Character index within the line for splice action
  oldText?: string;
  newText?: string;
}

export function calculateDiff(prev: string, next: string, affectedLines?: number[]): EditorPatch[] {
  const prevLines = prev.split('\n');
  const nextLines = next.split('\n');
  const patches: EditorPatch[] = [];

  // Determine the lines to process
  const linesToProcess =
    affectedLines ??
    Array.from({ length: Math.max(prevLines.length, nextLines.length) }, (_, i) => i);

  // Process the determined lines
  for (const line of linesToProcess) {
    const prevLine = prevLines[line] ?? '';
    const nextLine = nextLines[line] ?? '';

    if (prevLine !== nextLine) {
      if (prevLine === '' && nextLine !== '') {
        // Entire line added in next
        patches.push({ action: 'insert', lineNumber: line, newText: nextLine });
      } else if (nextLine === '' && prevLine !== '') {
        // Entire line deleted in next
        patches.push({ action: 'delete', lineNumber: line, oldText: prevLine });
      } else {
        // Line changed - perform granular comparison
        const minLen = Math.min(prevLine.length, nextLine.length);
        let charIndex = 0;

        // Find the first different character
        while (charIndex < minLen && prevLine[charIndex] === nextLine[charIndex]) {
          charIndex++;
        }

        if (charIndex < prevLine.length) {
          // Characters deleted in prevLine
          patches.push({
            action: 'splice',
            lineNumber: line,
            index: charIndex,
            oldText: prevLine.substring(charIndex),
            newText: '',
          });
        }

        if (charIndex < nextLine.length) {
          // Characters added in nextLine
          patches.push({
            action: 'splice',
            lineNumber: line,
            index: charIndex,
            oldText: '',
            newText: nextLine.substring(charIndex),
          });
        }
      }
    }
  }

  return patches;
}
