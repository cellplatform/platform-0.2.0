import { describe, it, expect, MemoryMock, Path, slug, t } from './test';
import { Filesystem } from './Filesystem.mjs';
import { IndexedDbDriver } from './index.mjs';
import { Spec } from 'sys.fs.spec';

describe('Filesystem (IndexedDB)', () => {
  it('Filesystem.Driver', () => {
    expect(Filesystem.Driver.kind).to.eql('IndexedDb');
  });
});

describe('Filesystem: Functional Specification (IndexedDb)', () => {
  const root = MemoryMock.DEFAULT.rootdir;

  const factory: t.FsDriverFactory = async (dir) => {
    dir = Path.join(root, Path.trim(dir));
    const id = `fs:test.${slug()}`;
    const db = await IndexedDbDriver({ id, dir });
    return db.driver;
  };

  Spec.every({ factory, describe, it, root });
});
