import { Immutable } from '.';
import { describe, expect, it, type t } from '../test';
import { rx } from './common';

describe('Immutable.map', () => {
  type P = t.PatchOperation;
  type Child = { msg?: string };
  type D = { count: number; child?: Child };
  type F = { foo: number; text: string };

  it('instance (id)', () => {
    const doc = Immutable.clonerRef<D>({ count: 0 });
    const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });
    expect(map.instance).to.be.a('String');
    expect(map.instance).to.not.eql(doc.instance);
  });

  describe('read/write', () => {
    it('read (current)', () => {
      const doc = Immutable.clonerRef<D>({ count: 0 });
      const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });

      expect(map.current.foo).to.eql(0);
      expect(map.current.text).to.eql(undefined);
      expect((map.current as any).zoo).to.eql(undefined); // NB: does not exist.

      // Change underlying doc
      doc.change((d) => {
        d.count = 123;
        d.child = { msg: 'hello' };
      });

      expect(map.current.foo).to.eql(123);
      expect(map.current.text).to.eql('hello');
    });

    it('write: immutable change', () => {
      const doc = Immutable.clonerRef<D>({ count: 0 });
      const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });

      expect(doc.current.count).to.eql(0);
      expect(map.current.foo).to.eql(0);

      map.change((d) => (d.foo = 123));

      expect(doc.current.count).to.eql(123);
      expect(map.current.foo).to.eql(123);
    });

    it('write: patches callback', () => {
      const doc = Immutable.clonerRef<D>({ count: 0 });
      const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });
      const patches: P[] = [];
      map.change(
        (d) => {
          d.foo = 123;
          d.text = 'hello';
        },
        (e) => patches.push(...e),
      );
      expect(map.current.foo).to.eql(123);
      expect(map.current.text).to.eql('hello');

      expect(patches.length).to.eql(2);
      expect(patches[0].path).to.eql('/count'); // NB: patches pertain to the underlying target.
      expect(patches[1].path).to.eql('/child');
    });
  });

  describe('composite', () => {
    it('subset of two documents', () => {
      const doc1 = Immutable.clonerRef<D>({ count: 123 });
      const doc2 = Immutable.clonerRef<D>({ count: 0, child: { msg: 'hello' } });
      const map = Immutable.map<F>({ foo: [doc1, ['count']], text: [doc2, ['child', 'msg']] });

      expect(map.current.foo).to.eql(123);
      expect(map.current.text).to.eql('hello');

      map.change((d) => {
        d.foo = 456;
        d.text = 'hazaar';
      });

      expect(map.current.foo).to.eql(456);
      expect(map.current.text).to.eql('hazaar');

      expect(doc1.current.count).to.eql(456);
      expect(doc2.current.child!.msg).to.eql('hazaar');
    });

    it('map to deep sub-paths', () => {
      type F = { total: number; msg?: string };
      const doc = Immutable.clonerRef<D>({ count: 0, child: { msg: 'hello' } });
      const map = Immutable.map<F>({ total: [doc, 'count'], msg: [doc, ['child', 'msg']] });
      expect(map.current.msg).to.eql('hello');

      map.change((d) => (d.msg = 'wowow'));
      expect(map.current.msg).to.eql('wowow');
      expect(doc.current.child?.msg).to.eql('wowow');
    });

    it('map of maps', () => {
      type A = { total: number; msg?: string };
      type B = { message?: string };
      const doc = Immutable.clonerRef<D>({ count: 0, child: { msg: 'hello' } });
      const map1 = Immutable.map<A>({ total: [doc, 'count'], msg: [doc, ['child', 'msg']] });
      const map2 = Immutable.map<B>({ message: [map1, 'msg'] });

      expect(map2.current.message).to.eql('hello');
      map1.change((d) => (d.msg = 'jane'));
      expect(map2.current.message).to.eql('jane');

      map2.change((d) => (d.message = 'lane'));
      expect(map1.current.msg).to.eql('lane');
    });
  });

  describe('Reflect', () => {
    it('Object.keys ← Reflect.ownKeys', () => {
      const doc = Immutable.clonerRef<D>({ count: 0, child: { msg: 'hello' } });
      const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });
      expect(Object.keys(map.current)).to.eql(['foo', 'text']);
    });

    it('Object.getOwnPropertyDescriptor', () => {
      const doc = Immutable.clonerRef<D>({ count: 0, child: { msg: 'hello' } });
      const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });

      const getDescriptor = () => Object.getOwnPropertyDescriptor(map.current, 'foo');
      expect(getDescriptor()?.value).to.eql(0);

      map.change((d) => (d.foo = 123));
      expect(getDescriptor()?.value).to.eql(123);
    });

    it('Is.map', () => {
      const doc = Immutable.clonerRef<D>({ count: 0, child: { msg: 'hello' } });
      const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });

      expect(Immutable.Is.map(map)).to.eql(true);

      const NON = [true, 123, {}, [], Symbol('foo'), BigInt(0)];
      NON.forEach((value) => expect(Immutable.Is.map(value)).to.eql(false));
    });

    it('Is.proxy', () => {
      const doc = Immutable.clonerRef<D>({ count: 0, child: { msg: 'hello' } });
      const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });

      expect(Immutable.Is.proxy(map)).to.eql(false);
      expect(Immutable.Is.proxy(map.current)).to.eql(true);

      const NON = [true, 123, {}, [], Symbol('foo'), BigInt(0)];
      NON.forEach((value) => expect(Immutable.Is.map(value)).to.eql(false));
    });

    it('Immutable.toObject', () => {
      const doc = Immutable.clonerRef<D>({ count: 123, child: { msg: 'hello' } });
      const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });

      const obj1 = Immutable.toObject(map);
      const obj2 = Immutable.toObject(map.current);
      const obj3 = Immutable.Map.toObject(map);

      expect(obj1).to.eql(obj2);
      expect(obj1).to.eql(obj3);
      expect(obj1).to.eql({ foo: 123, text: 'hello' });
    });
  });

  describe('events', () => {
    type E = t.ImmutableChange<F, t.PatchOperation>;
    type P = t.ImmutableMapPatchDefault;

    it('change → events ⚡️before/after', () => {
      const { dispose, dispose$ } = rx.lifecycle();
      const doc = Immutable.clonerRef<D>({ count: 0 });
      const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, ['child', 'msg']] });

      const fired: E[] = [];
      const events = map.events(dispose$);
      events.changed$.subscribe((e) => fired.push(e));

      map.change((d) => (d.foo = 888));
      map.change((d) => (d.text = 'hello'));

      expect(fired.length).to.equal(2);

      expect(fired[0].before.foo).to.eql(0);
      expect(fired[0].before.text).to.eql(undefined);
      expect(fired[0].after.foo).to.eql(888);
      expect(fired[0].after.text).to.eql(undefined);

      expect(fired[1].before.foo).to.eql(888);
      expect(fired[1].before.text).to.eql(undefined);
      expect(fired[1].after.foo).to.eql(888);
      expect(fired[1].after.text).to.eql('hello');

      dispose();
    });

    it('event patches include mapping info', () => {
      const { dispose, dispose$ } = rx.lifecycle();
      const doc1 = Immutable.clonerRef<D>({ count: 0 });
      const doc2 = Immutable.clonerRef<D>({ count: 0, child: { msg: 'hello' } });
      const map = Immutable.map<F>({ foo: [doc1, ['count']], text: [doc2, ['child', 'msg']] });

      const fired: E[] = [];
      const events = map.events(dispose$);
      events.changed$.subscribe((e) => fired.push(e));

      map.change((d) => {
        d.foo = 123;
        d.text = 'world!';
      });

      const patches = fired[0].patches as P[];
      expect(fired.length).to.eql(1);
      expect(patches.length).to.eql(2);

      expect(patches[0].mapping.key).to.eql('foo');
      expect(patches[1].mapping.key).to.eql('text');

      expect(patches[0].mapping.doc).to.eql(`instance:${doc1.instance}`);
      expect(patches[1].mapping.doc).to.eql(`instance:${doc2.instance}`); // NB: indicates where the change was actually written to.

      dispose();
    });

    it('custom event patch formatter', () => {
      const { dispose, dispose$ } = rx.lifecycle();
      const doc = Immutable.clonerRef<D>({ count: 0 });

      const formatPatch: t.ImmutableMapFormatPatch<P> = (e) => {
        const key = `test-${e.key}`;
        const doc = `uri:wowow`;
        return { ...e.patch, mapping: { key, doc } };
      };

      const map = Immutable.map<F, P>(
        { foo: [doc, ['count']], text: [doc, ['child', 'msg']] },
        { formatPatch },
      );

      const fired: E[] = [];
      const events = map.events(dispose$);
      events.changed$.subscribe((e) => fired.push(e));

      map.change((d) => (d.foo = 123));

      const patches = fired[0].patches as P[];
      expect(patches[0].mapping.key).to.eql('test-foo');
      expect(patches[0].mapping.doc).to.eql('uri:wowow');

      dispose();
    });

  });
});
