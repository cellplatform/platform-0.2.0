import { describe, it, expect, type t } from '../test';
import { Path } from '.';

describe('Json.Path', () => {
  describe('TypedJsonPath', () => {
    type MyObject = { root: { foo: { count: number } } };
    it('deep type, partial and full', () => {
      type P = t.TypedJsonPath<MyObject>;
      const path1: P = ['root'];
      const path2: P = ['root', 'foo'];
      const path3: P = ['root', 'foo', 'count'];
    });
  });

  describe('resolve', () => {
    type R = typeof root;
    const root = {
      msg: 'hello',
      child: { foo: { count: 123 }, bar: null },
      list: [1, { msg: 'two' }, ['a', 'b', null]],
    };

    it('returns {root} ← param []', () => {
      const res = Path.resolve<R>(root, []);
      expect(res).to.eql(root);
    });

    it('returns match', () => {
      const res1 = Path.resolve<R>(root, ['msg']);
      const res2 = Path.resolve<R>(root, ['child']);
      const res3 = Path.resolve<R>(root, ['child', 'foo']);
      const res4 = Path.resolve<R>(root, ['child', 'foo', 'count']);
      const res5 = Path.resolve<R>(root, ['child', 'bar']);

      expect(res1).to.eql('hello');
      expect(res2).to.equal(root.child);
      expect(res3).to.equal(root.child.foo);
      expect(res4).to.eql(123);
      expect(res5).to.eql(null);
    });

    it('matches when root is an [array]', () => {
      expect(Path.resolve<R>([], [0])).to.equal(undefined);
      expect(Path.resolve<R>([root], [0, 'msg'])).to.equal('hello');
      expect(Path.resolve<R>([root, root], [1, 'list', 2, '0'])).to.equal('a');
    });

    it('interprets numbers as indexes', () => {
      expect(Path.resolve<R>(root, ['list', 0])).to.eql(1);
      expect(Path.resolve<R>(root, ['list', '0'])).to.eql(1);
      expect(Path.resolve<R>(root, ['list', '0 '])).to.eql(undefined); // NB: space in path
      expect(Path.resolve<R>(root, ['list', 1])).to.equal(root.list[1]);
      expect(Path.resolve<R>(root, ['list', 2, 1])).to.eql('b');
      expect(Path.resolve<R>(root, ['list', 2, 999])).to.eql(undefined);
      expect(Path.resolve<R>(root, ['list', 2, 2])).to.eql(null);
    });

    it('throws if root not an object', () => {
      [null, undefined, 123, true, ''].forEach((value) => {
        const fn = () => Path.resolve(value as any, []);
        expect(fn).to.throw(/root is not an object/);
      });
    });
  });

  describe('mutate', () => {
    type R = { msg?: string; child?: { foo?: { count: number } } };

    it('set value shaoow', () => {
      const root: R = {};
      Path.mutate(root, ['msg'], 'hello');
      expect(root.msg).to.eql('hello');
    });

    it('set value deep', () => {
      const root: R = {};
      Path.mutate(root, ['child', 'foo', 'count'], 123);
      expect(root.child?.foo?.count).to.eql(123);
    });

    it('does not replace existing objects', () => {
      const root: R = { child: { foo: { count: 0 } } };
      const refChild = root.child;
      const refFoo = root.child?.foo;

      Path.mutate(root, ['child', 'foo', 'count'], 123);
      expect(root.child?.foo?.count).to.eql(123);
      expect(root.child).to.equal(refChild); // NB: same instance.
      expect(root.child?.foo).to.eql(refFoo);
    });

    it('throws if path is empty', () => {
      [[], undefined, null].forEach((path: any) => {
        const root: R = {};
        const fn = () => Path.mutate(root, path, 'foo');
        expect(fn).to.throw(/path cannot be empty/);
      });
    });

    it('throws if root not an object', () => {
      [null, undefined, 123, true, ''].forEach((root) => {
        const fn = () => Path.mutate(root, ['msg'], 'foo');
        expect(fn).to.throw(/root is not an object/);
      });
    });
  });
});
