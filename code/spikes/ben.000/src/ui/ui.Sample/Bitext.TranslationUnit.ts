export const TranslationUnit = {
  linebreakCharacters: ['↩︎', '↲', '↵'],

  /**
   * Create a new instance of a translation-pair.
   */
  create(options: { source?: string; target?: string } = {}): TranslationUnitType {
    const { source = '', target = '' } = options;
    return { source, target };
  },

  clean(pair: TranslationUnitType): TranslationUnitType {
    let { source = '', target = '' } = pair;
    // const source = pair.source.replace(//, '')
    TranslationUnit.linebreakCharacters.forEach((char) => {
      source = source.replaceAll(char, '').replaceAll(' ', '');
    });

    return { ...pair, source, target };
  },
} as const;

/**
 * Types
 */

export type TranslationUnitType = {
  readonly source: string;
  readonly target: string;
};
