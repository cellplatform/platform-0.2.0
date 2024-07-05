import { Text } from '.';
import { describe, expect, it, type t } from '../test';

describe('Doc.Text', () => {
  describe('Text.diff', () => {
    const assertDiff = (diff: t.TextDiff, index: number, delCount: number, newText?: string) => {
      expect(diff.index).to.eql(index);
      expect(diff.delCount).to.eql(delCount);
      expect(diff.newText).to.eql(newText);
    };

    it('no change', () => {
      const diff = Text.diff('foo', 'foo', 3);
      assertDiff(diff, 3, 0, '');
    });

    it('insert (single char)', () => {
      const diff1 = Text.diff('', 'a', 1);
      const diff2 = Text.diff('a', 'ab', 2);
      const diff3 = Text.diff('ab', 'acb', 2);
      assertDiff(diff1, 0, 0, 'a');
      assertDiff(diff2, 1, 0, 'b');
      assertDiff(diff3, 1, 0, 'c');
    });

    it('delete', () => {
      const diff1 = Text.diff('', 'abcd', 4);
      const diff2 = Text.diff('abcd', 'acd', 1);
      const diff3 = Text.diff('abc', 'a', 1);
      assertDiff(diff1, 0, 0, 'abcd');
      assertDiff(diff2, 1, 1, '');
      assertDiff(diff3, 1, 2, '');
    });

    it('replace all', () => {
      const diff1 = Text.diff('a', 'z', 1);
      const diff2 = Text.diff('abcd', 'z', 1);
      assertDiff(diff1, 0, 1, 'z');
      assertDiff(diff2, 0, 4, 'z');
    });
  });

  describe('Text.splice', () => {
    it('splice: new text', () => {
      const doc = { foo: {} };
      const path = ['foo', 'text'];

      Text.splice(doc, path, 0, 0, 'hello');
      expect(doc.foo).to.eql({ text: 'hello' });

      Text.splice(doc, path, 4, 0, ' n');
      expect(doc.foo).to.eql({ text: 'hell no' });
    });

    it('splice: delete', () => {
      const doc = { foo: { text: 'hello' } };
      const path = ['foo', 'text'];

      Text.splice(doc, path, 0, 1);
      expect(doc.foo).to.eql({ text: 'ello' });

      Text.splice(doc, path, 1, 2);
      expect(doc.foo).to.eql({ text: 'eo' });
    });

    it('diff then splice', () => {
      const doc = { text: 'hello' };
      const diff = Text.diff(doc.text, 'z', 1);
      Text.splice(doc, ['text'], diff.index, diff.delCount, diff.newText);
      expect(doc.text).to.eql('z');
    });

    it('throw: path is empty', () => {
      const doc = {};
      const fn = () => Text.splice(doc, [], 0, 0, 'hello');
      expect(fn).to.throw(/Target path is empty/);
    });

    it('throw: target parent not an object', () => {
      const doc = {};
      const fn = () => Text.splice(doc, ['foo', 'text'], 0, 0, 'hello');
      expect(fn).to.throw(/Target path "foo\.text" is not within an object/);
    });

    it('throw: target is not a string', () => {
      const test = (doc: any) => {
        const fn = () => Text.splice(doc, ['text'], 0, 0, 'hello');
        expect(fn).to.throw(/Target path "text" is not a string/);
      };
      const INVALID = [123, false, null, {}, [], Symbol('foo'), BigInt(0)];
      INVALID.forEach((text) => test({ text }));
    });
  });
});
