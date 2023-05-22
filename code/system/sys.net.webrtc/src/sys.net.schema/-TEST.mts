import { Crdt, Dev, expect } from '../test.ui';
import { NetworkSchema } from './Schema.mjs';

import type { DocShared } from './Schema.mjs';

export default Dev.describe('Network Schema', (e) => {
  e.it('NetworkSchema.initial', (e) => {
    const initial = NetworkSchema.initial;

    expect(initial.doc.network.peers).to.eql({});
    expect(initial.doc.network.props).to.eql({});
    expect(initial.doc.tmp).to.eql({});
    expect(initial.bytes instanceof Uint8Array).to.eql(true);

    // NB: Different instances.
    expect(NetworkSchema.initial).to.not.equal(NetworkSchema.initial);
    expect(NetworkSchema.initial.doc).to.not.equal(NetworkSchema.initial.doc);
  });

  e.it('NetworkSchema.genesis ← generates byte-array (source code, typescript)', async (e) => {
    const genesis = NetworkSchema.genesis();
    const schema = genesis.schema;

    expect(schema.sourceFile).to.include('export type NetworkDocShared = {');
    expect(schema.toString()).to.eql(schema.sourceFile);
    expect(schema.bytes instanceof Uint8Array).to.eql(true);
  });

  e.it('NetworkSchema.doc ← initial Document<T> (schema) from encoded byte-array', async (e) => {
    const { bytes: initialState } = await import('./Schema.bytes.mjs');
    const doc = Crdt.Doc.ref<DocShared>('doc-id', initialState);
    expect(doc.current).to.eql(NetworkSchema.initial.doc);

    const schema = NetworkSchema.genesis();
    expect(schema.doc.current).to.eql(NetworkSchema.initial.doc);
  });
});
