import { Spec } from 'sys.fs.spec';

import { Filesystem, NodeDriver } from './index.mjs';
import { NodeFs } from './node';
import { MemoryMock, Path, describe, expect, it, type t } from './test';

describe('Filesystem (Node)', { retry: 3 }, () => {
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
    expect(m.files.find((file) => file.path === path)?.filehash).to.eql(file.hash);
  });
});

/**
 * Baseline functional specifications from [sys.fs].
 */
describe('Filesystem: Functional Specification (Node.js)', () => {
  const root = NodeFs.resolve('tmp/spec');

  const factory: t.FsDriverFactory = async (dir) => {
    await NodeFs.remove(root); // NB: reset test state.
    dir = Path.join(root, Path.trim(dir));
    return NodeDriver({ dir });
  };

  Spec.every({ root, factory, describe, it });
});
