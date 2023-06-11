import { rx, Dev, Filesystem, expect, Path, t, slug } from '../common';
import { MemoryMock } from 'sys.fs.spec';
import { Spec } from 'sys.fs.spec';

export default Dev.describe('Complete Functional Specification (IndexedDb)', (e) => {
  console.log('Spec', Spec);
  console.log('Spec.every', Spec.every);

  const factory: t.FsDriverFactory = async (dir) => {
    dir = Path.join('/tmp.unit-tests/', Path.trim(dir));
    const id = `fs:test.${slug()}`;
    const db = await Filesystem.Driver.IndexedDb({ id, dir });
    return db.driver;
  };

  const { describe, it } = e;

  /**
   * TODO 🐷
   * Make a detached version of function: describe, it
   * That pipe the definition invoking structure into an [e.describe, e.it] structure.
   *
   *
   * Design Notes:
   *    This is not a disimilar pattern of "function call" counting that
   *    React's [use<Hook>] pattern uses.
   */

  // Spec.every({ factory, describe, it, root });
});
