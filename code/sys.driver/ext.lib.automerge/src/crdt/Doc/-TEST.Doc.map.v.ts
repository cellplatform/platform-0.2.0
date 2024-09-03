import { Doc } from '..';
import { describe, expect, it, rx, type t } from '../../test';
import { testSetup } from './-TEST.u';

describe('Doc.map (composite)', () => {
  const { store, factory } = testSetup();
  type F = { foo: number; text?: string };

  it('read/write', async () => {
    const doc = await factory();
    const map = Doc.map<F>({ foo: [doc, 'count'], text: [doc, 'msg'] });

    expect(map.current.foo).to.eql(0);
    expect(map.current.text).to.eql(undefined);

    map.change((d) => {
      d.foo = 555;
      d.text = 'hello';
    });

    expect(map.current.foo).to.eql(555);
    expect(map.current.text).to.eql('hello');
  });

  it('patches (callback)', async () => {
    const doc = await factory();
    const map = Doc.map<F>({ foo: [doc, 'count'], text: [doc, 'msg'] });

    const patches: t.Patch[] = [];
    map.change(
      (d) => (d.foo = 123),
      (e) => patches.push(...e),
    );

    expect(patches.length).to.eql(1);
    expect(patches[0].path).to.eql(['count']);
    expect(patches[0].action).to.eql('put');
  });

  it('composite of multiple documents', async () => {
    const doc1 = await factory();
    const doc2 = await factory();
    const map = Doc.map<F>({ foo: [doc1, 'count'], text: [doc2, 'msg'] });

    expect(map.current.foo).to.eql(0);
    expect(map.current.text).to.eql(undefined);

    doc1.change((d) => (d.count = 123));
    doc2.change((d) => (d.msg = 'hello'));

    expect(map.current.foo).to.eql(123);
    expect(map.current.text).to.eql('hello');
  });

  it('toObject', async () => {
    const doc = await factory();
    const map = Doc.map<F>({ foo: [doc, 'count'], text: [doc, 'msg'] });

    map.change((d) => {
      d.foo = 123;
      d.text = 'hello';
    });

    const obj1 = Doc.toObject(map);
    const obj2 = Doc.toObject(map.current);
    expect(obj1).to.eql({ foo: 123, text: 'hello' });
    expect(obj2).to.eql({ foo: 123, text: 'hello' });
  });

  describe('events', () => {
    type E = t.ImmutableChange<F, t.DocMapPatch>;

    it('change → events ⚡️before/after', async () => {
      const { dispose, dispose$ } = rx.lifecycle();
      const doc = await factory();
      const map = Doc.map<F>({ foo: [doc, 'count'], text: [doc, 'msg'] });

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

    it('formatted patches (document URIs)', async () => {
      const { dispose, dispose$ } = rx.lifecycle();
      const doc1 = await factory();
      const doc2 = await factory();
      const map = Doc.map<F>({ foo: [doc1, 'count'], text: [doc2, 'msg'] });

      const fired: E[] = [];
      const events = map.events(dispose$);
      events.changed$.subscribe((e) => fired.push(e));

      map.change((d) => {
        d.foo = 888;
        d.text = 'hello';
      });

      const patches = fired[0].patches;
      expect(fired.length).to.eql(1);
      expect(patches.length).to.eql(3);

      expect(patches.map((p) => p.action)).to.eql(['put', 'put', 'splice']);
      expect(patches[0].path).to.eql(['count']);
      expect(patches[1].path).to.eql(['msg']);
      expect(patches[2].path).to.eql(['msg', 0]);

      expect(patches.map((p) => p.mapping.key)).to.eql(['foo', 'text', 'text']);
      expect(patches[0].mapping.doc).to.eql(doc1.uri);
      expect(patches[1].mapping.doc).to.eql(doc2.uri); // NB: composite from multiple documents.
      expect(patches[2].mapping.doc).to.eql(doc2.uri);

      dispose();
    });

  });

  it('|test.dispose|', () => store.dispose());
});
