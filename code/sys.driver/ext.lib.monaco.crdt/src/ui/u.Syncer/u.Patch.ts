import { Value, type t } from './common';
import { PathUtil } from './u.Path';

type PatchInput = t.Patch | t.Patch[];

export const PatchUtil = {
  /**
   * Helpers for updating a Monaco editor from JSON patches.
   */
  monaco(monaco: t.Monaco, editor: t.MonacoCodeEditor) {
    return {
      /**
       * Splice
       */
      splice(patch: t.SpliceTextPatch, source: string) {
        const index = patch.path[patch.path.length - 1];
        const text = patch.value ?? '';
        if (typeof index !== 'number') return;

        // Convert the index to a position in the Monaco Editor model.
        const position = editor.getModel()?.getPositionAt(index);
        if (!position) return;

        const range = new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column + (text ? text.length : 0),
        );

        // Apply the edit operation to the editor.
        const operation = { range, text, forceMoveMarkers: true };
        editor.executeEdits(source, [operation]);
      },

      /**
       * Apply a delete patch.
       */
      delete(patch: t.DelPatch, source: string) {
        const index = patch.path[patch.path.length - 1];
        const deleteCount = patch.length ?? 1;

        if (typeof index !== 'number') return;
        if (deleteCount < 1) return;

        // Convert `index` and `deleteCount` to a Range.
        // NOTE: Monaco's positions are 1-based (not 0-based).
        const startPosition = editor.getModel()?.getPositionAt(index);
        const endPosition = editor.getModel()?.getPositionAt(index + deleteCount);
        if (!(startPosition && endPosition)) return;

        const range = new monaco.Range(
          startPosition.lineNumber,
          startPosition.column,
          endPosition.lineNumber,
          endPosition.column,
        );

        // Apply the edit operation to the editor.
        const operation = { range, text: null, forceMoveMarkers: true };
        editor.executeEdits(source, [operation]);
      },
    } as const;
  },

  /**
   * Matches
   */
  Includes: {
    identity(input: PatchInput, options: { paths?: t.EditorPaths; identity?: string } = {}) {
      const patches = wrangle.patches(input);
      const paths = PathUtil.wrangle(options.paths);
      const path = [...paths.identity];
      if (options.identity) path.push(options.identity);
      return patches.some((p) => Value.Array.compare(p.path).startsWith(path));
    },

    selection(input: PatchInput) {
      const patches = wrangle.patches(input);
      return patches.some((p) => PathUtil.Is.selections(p.path));
    },
  },

  /**
   * Path extraction
   */
  extractIdentity(patches: t.Patch[], options: { paths?: t.EditorPaths } = {}) {
    const paths = PathUtil.wrangle(options.paths);
    const first = patches.find((p) => Value.Array.compare(p.path).startsWith(paths.identity));
    return String(first ? first.path[paths.identity.length] : '');
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  patches(input: PatchInput): t.Patch[] {
    return Array.isArray(input) ? input : [input];
  },
} as const;
