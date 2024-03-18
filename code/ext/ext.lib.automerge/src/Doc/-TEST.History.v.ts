import { DEFAULTS, Doc } from '.';
import { Time, describe, expect, expectRoughlySame, it, type t } from '../test';
import { testSetup, type D } from './-TEST.u';

describe('Doc.History', async () => {
  const { store } = testSetup();

  it('initial: <none>', async () => {
    const doc = await store.doc.getOrCreate<D>((d) => null);
    const history = Doc.history(doc);
    const commits = history.commits;
    expect(commits.length).to.eql(2);
    expect(commits[0].snapshot).to.eql({});
    expect(commits[1].snapshot).to.eql({});
  });

  it('initial: change', async () => {
    const doc = await store.doc.getOrCreate<D>((d) => (d.msg = 'hello'));
    const history = Doc.history(doc);
    const commits = history.commits;
    expect(commits.length).to.eql(2);
    expect(commits[0].snapshot).to.eql({});
    expect(commits[1].snapshot).to.eql({ msg: 'hello' });
  });

  it('change history', async () => {
    const doc = await store.doc.getOrCreate<D>((d) => null);
    expect(Doc.history(doc).commits.length).to.eql(2);

    doc.change((d) => (d.msg = 'hello'));
    const commits = Doc.history(doc).commits;
    expect(commits.length).to.eql(3);
    expect(commits[0].snapshot).to.eql({});
    expect(commits[1].snapshot).to.eql({});
    expect(commits[2].snapshot).to.eql({ msg: 'hello' });
  });

  it('inserts timestamp upon creation (metadata)', async () => {
    const assert = (doc: t.DocRef<D>) => {
      const commits = Doc.history(doc).commits;
      const now = Time.now.timestamp;
      const genesis = commits[1].change;
      expectRoughlySame(genesis.time, now, 0.1, `genesis timestamp`);
      expect(genesis.message).to.eql(DEFAULTS.message.initial);
    };

    const doc1 = await store.doc.getOrCreate<D>((d) => null); // NB: no initial object setup.
    const doc2 = await store.doc.getOrCreate<D>((d) => (d.count = 123));
    assert(doc1);
    assert(doc2);
  });

  it('|test.dispose|', () => store.dispose());
});
