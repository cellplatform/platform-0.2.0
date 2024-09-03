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

    console.log('after', Doc.toObject(map.current));

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
    type E = t.ImmutableChange<F, t.Patch>;

  });

  it('|test.dispose|', () => store.dispose());
});
