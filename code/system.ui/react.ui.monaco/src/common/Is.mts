import type { t } from '../common.t';
import { R } from './libs.mjs';
import { asRange } from './Wrangle.asRange.mjs';
import { DEFAULTS } from './const.mjs';

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

  nullRange(input: t.EditorRange): boolean {
    return R.equals(input, DEFAULTS.NULL_RANGE);
  },

  span(input: t.EditorRangeInput) {
    return !Is.singleChar(input);
  },

  singleChar(input: t.EditorRangeInput) {
    const range = asRange(input);
    return range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn;
  },
};
