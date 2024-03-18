import { Doc } from '.';
import { describe, expect, it } from '../test';
import { testSetup, type D } from './-TEST.u';

describe('Doc.History', async () => {
  const { store } = testSetup();

  it('initial: <none>', async () => {
    const doc = await store.doc.getOrCreate<D>((d) => null);
    const history = Doc.history(doc);
    const commits = history.commits;
    expect(commits.length).to.eql(1);
    expect(commits[0].snapshot).to.eql({});
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
    expect(Doc.history(doc).commits.length).to.eql(1);

    doc.change((d) => (d.msg = 'hello'));
    const commits = Doc.history(doc).commits;
    expect(commits.length).to.eql(2);
    expect(commits[0].snapshot).to.eql({});
    expect(commits[1].snapshot).to.eql({ msg: 'hello' });
  });

  it('|test.dispose|', () => store.dispose());
});
