import { Automerge } from '..';
import { expect, Test } from '../../test.ui';

export default Test.describe('Initial document structure (multi-peer)', (e) => {
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
  e.describe('hard-coded byte array [Uint8Array]', (e) => {
    type D = { list: number[] };

    let initialCommit: Uint8Array | undefined;
    let docA: Automerge.Doc<D>;

    e.it('→ create and initialize Document<T> structure', async (e) => {
      docA = Automerge.init<D>();
      docA = Automerge.change(docA, (doc) => (doc.list = [42] as any));
    });

    e.it(
      '→ get the change as a byte-array [Uint8Array] - Automerge.getLastLocalChange()',
      async (e) => {
        initialCommit = Automerge.getLastLocalChange(docA);
      },
    );

    e.it('sample: output string of code to save as file (*.ts)', async (e) => {
      /**
       *    - Hard-code the initial change and save it within the application source.
       *    - Save to a file.
       *
       * See:
       *    ./sample.mts (example under test)
       *
       * Also worth including within the comments or source of the file,
       * the typescript <Type> definition.
       */

      const byteArray = initialCommit?.toString();
      const code = `export const initialDoc = [${byteArray}];`;

      // eg:
      // fs.save(code, { filename: 'myfile.ts' });
    });

    e.it(
      '→ use the byte-array [Uint8Array] to create a new Document<T> on the different peer',
      async (e) => {
        const { initialDoc } = await import('./sample.mjs');
        const initial = new Uint8Array(initialDoc);

        let [docB] = Automerge.applyChanges<D>(Automerge.init(), [initial]);
        expect(docB.list).to.eql([42]);
      },
    );
  });
});
