import { CrdtSchema } from '..';
import { Crdt, expect, Test, toObject } from '../../test.ui';

export default Test.describe('Schema', (e) => {
  type D = { count: number; name?: string };

  e.describe('initial document structure (multi-peer safe)', (e) => {
    e.it('Schema (exposed from API)', async (e) => {
      expect(Crdt.Doc.Schema).to.exist;
      expect(Crdt.Doc.Schema).to.eql(CrdtSchema);
    });

    e.it('Schema.toByteArray', async (e) => {
      const initialObject: D = { count: 0, name: 'foo' };
      const byteArray = CrdtSchema.toByteArray<D>(initialObject);
      const code = byteArray.sourceFile; // NB: TypeScript source-code to save within module (aka. "schema" starting point).

      expect(byteArray.commit.byteLength).to.eql(70);
      expect(code).to.include('export type D = { count: number };');
      expect(code).to.include('export const initialState = new Uint8Array([');
      expect(code).to.eql(byteArray.toString());
    });

    e.it('initialize from byte-array (Uint8Array)', async (e) => {
      const initialObject: D = { count: 0, name: 'foo' };
      const docA = Crdt.Doc.ref<D>(initialObject);

      const { initialDoc } = await import('./-sample.mjs');
      const initial = new Uint8Array(initialDoc);
      expect(initial.byteLength).to.eql(70);

      // Create new doc from the byte-array.
      const docB = Crdt.Doc.ref<D>(initial);
      const docC = Crdt.Doc.ref<D>(initial);

      expect(toObject(docB)).to.eql(toObject(docA));
      expect(toObject(docC)).to.eql(toObject(docA));
    });
  });
});
