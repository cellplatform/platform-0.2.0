import type * as t from './t';

import { Is } from './Is';
import { asRange } from './Wrangle.asRange';
import { monaco } from './Wrangle.monaco';
import { DEFAULTS } from './constants';

export const Wrangle = {
  monaco,

  editorClassName(editor?: t.MonacoCodeEditor) {
    let id = editor?.getId() ?? '';
    if (id.includes(':')) id = `instance-${id.split(':')[1]}`;
    return `${DEFAULTS.className} ${id}`.trim();
  },

  asRange,
  asRanges(input?: t.EditorRangesInput): t.EditorRange[] {
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
