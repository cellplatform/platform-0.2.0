import { describe, it, expect, MemoryMock, Path } from './Test/index.mjs';
import { NodeFs } from './node/index.mjs';

import { Filesystem, NodeDriver } from './index.mjs';

describe('Filesystem (Node)', () => {
  it('Filesystem.Driver', () => {
    expect(Filesystem.Driver.kind).to.eql('Node');
    expect(Filesystem.Driver.Node).to.equal(NodeDriver);
  });

  it('Filesystem.client', async () => {
    const dir = NodeFs.resolve('tmp');

    const client = await Filesystem.client(dir);
    const { fs } = client;

    expect((await client.events.ready()).ready).to.eql(true);

    const subdir = 'client-test';
    await fs.delete(subdir);
    expect(await fs.exists(subdir)).to.eql(false);

    const path = Path.join(subdir, 'file.dat');
    const file = MemoryMock.randomFile();
    await fs.write(path, file.data);

    expect(await fs.exists(subdir)).to.eql(true);
    expect(await fs.read(path)).to.eql(file.data);

    const m = await fs.manifest();
    expect(m.files[0].filehash).to.eql(file.hash);
  });
});
