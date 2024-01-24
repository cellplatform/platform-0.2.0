import { describe, expect, it, type t } from '.';

import { Text, next as A } from '@automerge/automerge';
import { Repo } from '@automerge/automerge-repo';

describe('Automerge', () => {
  const repo = new Repo({ network: [] });

  describe('Text', () => {
    it('new Text() instance', () => {
      const text = new Text();
      expect(text.elems).to.eql([]);
    });

    it.skip('within change ƒ(n)', () => {
      type D = { text: t.Text };
      const handle = repo.create<D>();

      /**
       * TODO 🐷 BUG ← throws error
       * https://automerge.slack.com/archives/C61RJCM9S/p1706057615675409
       */
      handle.change((d: D) => (d.text = new Text()));

      // A.RawString
    });
  });

  describe('Counter', () => {
    it('within change ƒ(n)', () => {
      type D = { count: t.Counter };
      const handle = repo.create<D>();
      handle.change((d: D) => (d.count = new A.Counter(0)));
      handle.change((d: D) => d.count.increment(1));
      expect(handle.docSync().count.value).to.eql(1);
    });
  });
});
