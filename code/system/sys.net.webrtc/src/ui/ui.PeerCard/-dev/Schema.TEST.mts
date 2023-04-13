import { Crdt, Dev, expect } from '../../../test.ui';
import { NetworkSchema } from './Schema.mjs';

import type { DocShared } from './Schema.mjs';

export default Dev.describe('NetworkSchema (P2P)', (e) => {
  e.it('NetworkSchema.initial', (e) => {
    const initial = NetworkSchema.initial;
    expect(initial.doc.count).to.eql(0);
    expect(initial.doc.network).to.eql({ peers: {} });
    expect(initial.doc.tmp).to.eql({});
    expect(initial.bytes instanceof Uint8Array).to.eql(true);

    expect(NetworkSchema.initial.doc).to.not.equal(NetworkSchema.initial.doc);
  });

  e.it('NetworkSchema.genesis: generates byte-array (source code, typescript)', async (e) => {
    const genesis = NetworkSchema.genesis();
    const { schema } = genesis;

    expect(schema.sourceFile).to.include('export type DocShared = {');
    expect(schema.toString()).to.eql(schema.sourceFile);
    expect(schema.bytes instanceof Uint8Array).to.eql(true);
  });

  e.it('NetworkSchema.doc: initial Document<T> (schema) from encoded byte-array', async (e) => {
    const { bytes: initialState } = await import('./Schema.bytes.mjs');
    const doc1 = Crdt.Doc.ref<DocShared>('doc-id', initialState);
    expect(doc1.current).to.eql(NetworkSchema.initial.doc);

    const doc2 = NetworkSchema.genesis().doc;
    expect(doc2.current).to.eql(NetworkSchema.initial.doc);
  });
});
