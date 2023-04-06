import { DEFAULTS } from './const.mjs';
import type { t } from '../common.t';
import { Is } from './Is.mjs';

type RangeInput = t.EditorRange | [number, number, number, number] | [number, number];

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

  asRange(input: RangeInput) {
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

  asMonacoRange(monaco: t.Monaco, input: RangeInput) {
    const { startLineNumber, startColumn, endLineNumber, endColumn } = Wrangle.asRange(input);
    return new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn);
  },

  selections(input?: t.EditorSelectionInput): t.EditorRange[] {
    if (!input) return [];

    type V = t.EditorRange | t.CharPositionTuple;
    const isValue = (value: V) => Is.editorRange(value) || Is.charPositionTuple(value);
    const toRange = (value: V): t.EditorRange => {
      if (Is.editorRange(value)) return value;
      if (Is.charPositionTuple(value)) {
        return {
          startLineNumber: value[0],
          startColumn: value[1],
          endLineNumber: value[0],
          endColumn: value[1],
        };
      }
      throw new Error('Range conversion from input not supported');
    };

    if (Is.editorRange(input)) return [input];
    if (Is.charPositionTuple(input)) return [toRange(input)];
    if (Array.isArray(input)) return (input as V[]).filter(isValue).map(toRange);

    return [];
  },

  toRangeStart(input: t.EditorRange): t.EditorRange {
    return {
      startLineNumber: input.startLineNumber,
      startColumn: input.startColumn,
      endLineNumber: input.startLineNumber,
      endColumn: input.startColumn,
    };
  },

  toRangeEnd(input: t.EditorRange): t.EditorRange {
    return {
      startLineNumber: input.endLineNumber,
      startColumn: input.endColumn,
      endLineNumber: input.endLineNumber,
      endColumn: input.endColumn,
    };
  },
};
