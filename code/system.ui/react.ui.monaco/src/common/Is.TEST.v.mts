import { DEFAULTS, describe, expect, it, t } from '../test';
import { Is } from './Is.mjs';
import { Wrangle } from './Wrangle.mjs';

const { NULL_RANGE } = DEFAULTS;

describe('Is', () => {
  it('Is.editorRange', () => {
    const test = (input: any, expected: boolean) => {
      const res = Is.editorRange(input);
      expect(res).to.eql(expected);
    };

    const range: t.EditorRange = {
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 1,
    };
    test(range, true);
    [null, undefined, '', 123, [], {}, true].forEach((input) => test(input, false));
  });

  it('Is.charPositionTuple', () => {
    const test = (input: any, expected: boolean) => {
      const res = Is.charPositionTuple(input);
      expect(res).to.eql(expected);
    };

    const tuple: t.CharPositionTuple = [2, 5];
    test(tuple, true);
    [null, undefined, '', 123, [], {}, true].forEach((input) => test(input, false));
  });

  it('Is.nullRange', () => {
    expect(Is.nullRange(Wrangle.asRange([1, 5]))).to.eql(false);
    expect(Is.nullRange(NULL_RANGE)).to.eql(true);
  });

  it('Is.span | Is.singleChar', () => {
    const range1 = Wrangle.asRange([1, 5]);
    const range2 = Wrangle.asRange([1, 5, 1, 6]);

    expect(Is.singleChar(range1)).to.eql(true);
    expect(Is.singleChar(range2)).to.eql(false);

    expect(Is.span(range1)).to.eql(false);
    expect(Is.span(range2)).to.eql(true);
  });
});
