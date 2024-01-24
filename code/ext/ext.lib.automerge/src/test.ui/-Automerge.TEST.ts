import { Test, Text, WebStore, expect, type t } from '../test.ui';

export default Test.describe('Automerge (Library)', (e) => {
  const store = WebStore.init({ storage: false, network: false });

  e.describe('Text', (e) => {
    e.it('new Text()', (e) => {
      const text = new Text();
      expect(text.elems).to.eql([]);
    });

    e.it('within change', async (e) => {
      type D = { text: t.Text };
      /**
       * TODO 🐷 BUG ← throws error
       * https://automerge.slack.com/archives/C61RJCM9S/p1706057615675409
       */
      const doc = store.doc.getOrCreate<D>((d) => (d.text = new Text()));
    });
  });

  e.it('Cleanup', (e) => store.dispose());
});
