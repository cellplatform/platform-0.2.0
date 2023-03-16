import { Automerge } from '..';
import { R, Time, expect, Test } from '../../test.ui';

export default Test.describe('initial document structure (multi-peer)', (e) => {
  /**
   * REF: (Automerge Docs)
   *       https://automerge.org/docs/cookbook/modeling-data/
   *
   * QUOTE (from ^):
   *
   *   "If you really must initialize each device's copy of a document independently,
   *    there are some hacks you can use. One option is to do the initial
   *    `Automerge.change()` once to set up your schema, then call
   *    `Automerge.getLastLocalChange()` on the document (which returns a byte array),
   *    and hard-code that byte array into your application. Now, on each device
   *    that needs to initialize a document, you do this:
   *
   *    Hard-code the initial change:
   *
   *        const initChange = new Uint8Array([133, 111, 74, 131, ...])
   *        let [doc] = Automerge.applyChanges(Automerge.init(), [initChange])
   *
   *    This will set you up with a document whose initial change is the one you
   *    hard-coded. Any documents you set up with the same initial change will be
   *    able to merge."
   *
   */
  e.it(
    'hard-coded byte array hard-coded in application source: init → Automerge.getLastLocalChange() → [Uint8Array]',
    async (e) => {
      type D = { list: number[] };

      /**
       * Machine-1:
       *    - Create a document, and setup it's initial structure (change)
       *    - Get the initial change (as a byte array).
       */
      let docA = Automerge.init<D>();
      docA = Automerge.change(docA, (doc) => (doc.list = [42] as any));
      const initCommit1 = Automerge.getLastLocalChange(docA);

      /**
       *    - Hard-code the initial change and save it within the application source.
       *    - Save to a file.
       *
       * See:
       *    ./sample.mts (example under test)
       *
       * Also worth including within the comments or source of the file,
       * the typescript <Type> definition, eg <D>.
       */
      const code = `export const initialDoc = [${initCommit1?.toString()}];`;

      /**
       * Machine-2:
       *    - Create a document, and initialize it with the hard-coded byte array.
       */

      const { initialDoc } = await import('./sample.mjs');
      const initCommit2 = new Uint8Array(initialDoc);

      let [docB] = Automerge.applyChanges<D>(Automerge.init(), [initCommit2]);
      expect(docB.list).to.eql([42]);
    },
  );
});
