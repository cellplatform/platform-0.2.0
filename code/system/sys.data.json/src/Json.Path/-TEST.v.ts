import { describe, it, expect, type t } from '../test';
import { JsonPath } from '.';

describe('Json.Path', () => {
  describe('resolve', () => {
    type R = typeof root;
    const root = {
      msg: 'hello',
      child: { foo: { count: 123 }, bar: null },
      list: [1, { msg: 'two' }, ['a', 'b', null]],
    };

    it('returns root ← param []', () => {
      const res = JsonPath.resolve<R>(root, []);
      expect(res).to.eql(root);
    });

    it('returns match', () => {
      const res1 = JsonPath.resolve<R>(root, ['msg']);
      const res2 = JsonPath.resolve<R>(root, ['child']);
      const res3 = JsonPath.resolve<R>(root, ['child', 'foo']);
      const res4 = JsonPath.resolve<R>(root, ['child', 'foo', 'count']);
      const res5 = JsonPath.resolve<R>(root, ['child', 'bar']);

      expect(res1).to.eql('hello');
      expect(res2).to.equal(root.child);
      expect(res3).to.equal(root.child.foo);
      expect(res4).to.eql(123);
      expect(res5).to.eql(null);
    });

    it('interprets numbers as indexes', () => {
      expect(JsonPath.resolve<R>(root, ['list', 0])).to.eql(1);
      expect(JsonPath.resolve<R>(root, ['list', '0'])).to.eql(1);
      expect(JsonPath.resolve<R>(root, ['list', '0 '])).to.eql(undefined); // NB: space in path
      expect(JsonPath.resolve<R>(root, ['list', 1])).to.equal(root.list[1]);
      expect(JsonPath.resolve<R>(root, ['list', 2, 1])).to.eql('b');
      expect(JsonPath.resolve<R>(root, ['list', 2, 999])).to.eql(undefined);
      expect(JsonPath.resolve<R>(root, ['list', 2, 2])).to.eql(null);
    });

    it('throws if root not an object', () => {
      [null, undefined, 123, true, ''].forEach((value) => {
        const fn = () => JsonPath.resolve(value as any, []);
        expect(fn).to.throw(/root is not an object/);
      });
    });
  });
});
