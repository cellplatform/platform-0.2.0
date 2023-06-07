import { describe, it, expect } from '../../test';
import { type t } from '../common';
import { Wrangle } from './Wrangle.mjs';

describe('DocDiagram: Wrangle', () => {
  it('isImage', () => {
    const test = (input: any, expected: boolean) => {
      const res = Wrangle.isImage(input);
      expect(res).to.eql(expected);
    };

    test(undefined, false);
    test(null, false);
    test({}, false);
    test(123, false);
    test({ markkdown: '# Foo' }, false);

    test({ image: 'foo.png' }, true);
    test({ image: null }, true);
  });

  it('isMarkdown', () => {
    const test = (input: any, expected: boolean) => {
      const res = Wrangle.isMarkdown(input);
      expect(res).to.eql(expected);
    };

    test(undefined, false);
    test(null, false);
    test({}, false);
    test(123, false);
    test({ image: 'foo.png' }, false);

    test({ markdown: '# Foo' }, true);
    test({ markdown: null }, true);
  });

  it('toKind', () => {
    const test = (input: any, expected: t.DocDiagramMediaKind | undefined) => {
      const res = Wrangle.toKind(input);
      expect(res).to.eql(expected);
    };

    test(undefined, undefined);
    test(null, undefined);
    test({}, undefined);
    test(123, undefined);

    test({ image: 'foo.png' }, 'media.image');
    test({ markdown: '# Foo' }, 'media.markdown');
  });
});
