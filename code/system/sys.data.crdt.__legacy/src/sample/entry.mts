import { Crdt, rx } from '../index.mjs';
import { Filesystem } from 'sys.fs.indexeddb';

const bus = rx.bus();

const { dispose, events } = Crdt.Bus.Controller({ bus });

type Doc = { count: number };

(async () => {
  const fs = (await Filesystem.client({ bus })).fs;

  const path = 'foo/file.crdt';
  const doc = await events.doc<Doc>({ id: '1', initial: { count: 0 }, load: { fs, path } });

  await doc.change((doc) => doc.count++);
  await doc.save(fs, path, { json: true });

  console.group('🌳 CRDT');
  console.log('path', path);
  console.log('doc', doc);
  console.log('doc.current', doc.current);
  console.log('manifest', await fs.manifest());
  console.groupEnd();

  //
})();
