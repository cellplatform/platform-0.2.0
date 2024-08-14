import type * as t from './t';

/**
 * Helpers that require the full Monaco API.
 */
export function Monaco(monaco: t.Monaco) {
  const api = {
    offsets(editor: t.MonacoCodeEditor, selection: t.ISelection) {
      const { Range } = monaco;
      const model = editor.getModel();
      if (!model) throw new Error(`Editor did not return a text model.`);

      const position = api.position(selection);
      const range = Range.fromPositions(position.start, position.end);

      return {
        start: model.getOffsetAt(range.getStartPosition()),
        end: model.getOffsetAt(range.getEndPosition()),
      };
    },

    position(selection: t.ISelection) {
      const { Position } = monaco;
      const { selectionStartLineNumber, selectionStartColumn } = selection;
      const { positionLineNumber, positionColumn } = selection;
      return {
        start: new Position(selectionStartLineNumber, selectionStartColumn),
        end: new Position(positionLineNumber, positionColumn),
      };
    },
  } as const;
  return api;
}
