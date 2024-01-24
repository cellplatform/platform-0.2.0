import { describe, expect, it, type t } from '.';

import { Text } from '@automerge/automerge';
import { Repo } from '@automerge/automerge-repo';

describe('Automerge', () => {
  describe('Text', () => {
    it('new Text()', () => {
      const text = new Text();
      expect(text.elems).to.eql([]);
    });

    it('within change', () => {
      type D = { text: t.Text };
      const repo = new Repo({ network: [] });
      const handle = repo.create<D>();

      /**
       * TODO 🐷 BUG ← throws error
       * https://automerge.slack.com/archives/C61RJCM9S/p1706057615675409
       */
      handle.change((d: D) => (d.text = new Text()));
    });
  });
});
