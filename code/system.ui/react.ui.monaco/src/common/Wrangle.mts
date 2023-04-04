import { DEFAULTS } from './const.mjs';
import type { t } from '../common.t';

export const Wrangle = {
  editorClassName(editor?: t.MonacoCodeEditor) {
    let id = editor?.getId() ?? '';
    if (id.includes(':')) id = `instance-${id.split(':')[1]}`;
    return `${DEFAULTS.className} ${id}`.trim();
  },

  offsets(
    monaco: t.Monaco,
    editor: t.MonacoCodeEditor,
    selection: t.ISelection,
  ): t.SelectionOffset {
    const { Range } = monaco;
    const model = editor.getModel();
    if (!model) throw new Error(`Editor did not return a text model.`);

    const position = Wrangle.position(monaco, selection);
    const range = Range.fromPositions(position.start, position.end);
    return {
      start: model.getOffsetAt(range.getStartPosition()),
      end: model.getOffsetAt(range.getEndPosition()),
    };
  },

  position(monaco: t.Monaco, selection: t.ISelection) {
    const { Position } = monaco;
    const { selectionStartLineNumber, selectionStartColumn } = selection;
    const { positionLineNumber, positionColumn } = selection;
    return {
      start: new Position(selectionStartLineNumber, selectionStartColumn),
      end: new Position(positionLineNumber, positionColumn),
    };
  },

  asIRange(input: t.IRange | [number, number, number, number] | [number, number]) {
    if (Array.isArray(input)) {
      return input.length === 4
        ? {
            startLineNumber: input[0],
            startColumn: input[1],
            endLineNumber: input[2],
            endColumn: input[3],
          }
        : {
            startLineNumber: input[0],
            startColumn: input[1],
            endLineNumber: input[0],
            endColumn: input[1],
          };
    }
    const { startLineNumber, startColumn, endLineNumber, endColumn } = input;
    return {
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn,
    };
  },

  asRange(monaco: t.Monaco, input: t.IRange | [number, number, number, number] | [number, number]) {
    const { startLineNumber, startColumn, endLineNumber, endColumn } = Wrangle.asIRange(input);
    return new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn);
  },
};
