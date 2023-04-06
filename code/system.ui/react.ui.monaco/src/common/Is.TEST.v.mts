import { describe, expect, it, t } from '../test';
import { Is } from './Is.mjs';

describe('Is', () => {
  it('Is.editorRange', () => {
    const test = (input: any, expected: boolean) => {
      const res = Is.editorRange(input);
      expect(res).to.eql(expected);
    };

    [null, undefined, '', 123, [], {}, true].forEach((input) => test(input, false));

    const range: t.EditorRange = {
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 1,
    };
    test(range, true);
  });

  it('Is.charPositionTuple', () => {
    const test = (input: any, expected: boolean) => {
      const res = Is.charPositionTuple(input);
      expect(res).to.eql(expected);
    };

    [null, undefined, '', 123, [], {}, true].forEach((input) => test(input, false));

    const tuple: t.CharPositionTuple = [2, 5];
    test(tuple, true);
  });
});
