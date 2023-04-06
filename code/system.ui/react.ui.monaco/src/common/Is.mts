import type { t } from '../common.t';

export const Is = {
  number(value: any) {
    return typeof value === 'number' && !isNaN(value);
  },

  editorRange(input: any): input is t.EditorRange {
    if (!input) return false;
    if (typeof input !== 'object') return false;
    return (
      Is.number(input.startLineNumber) &&
      Is.number(input.startColumn) &&
      Is.number(input.endLineNumber) &&
      Is.number(input.endColumn)
    );
  },

  charPositionTuple(input: any): input is t.CharPositionTuple {
    if (!input) return false;
    if (!Array.isArray(input)) return false;
    return input.length === 2 && Is.number(input[0]) && Is.number(input[1]);
  },
};
