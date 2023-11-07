/**
 * Helpers for working with document URIs.
 */
export const DocUri = {
  /**
   * Extract the ID component of a document URI.
   * eg: "automerge:<abc>" → "<abc>"
   */
  id(input: any): string {
    if (typeof input !== 'string') return '';
    const text = input.trim();
    if (!text.includes(':')) return text;
    return text.split(':')[1] ?? '';
  },
} as const;
