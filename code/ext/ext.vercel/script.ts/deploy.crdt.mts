import { Crdt } from 'sys.data.crdt';
import { Filesystem } from 'sys.fs.node';
import { rx } from 'sys.util';

const bus = rx.bus();

/**
 * 🧠 SYSTEM: Filesystem
 */
const dir = process.cwd(); // READ/WRITE "scope" (security constraint).
const { fs } = await Filesystem.client(dir, { bus }); // <═══╗
//                                                           ║
//                                            SHARED EventBus 🌳

const controller = Crdt.Bus.Controller({ bus });
const crdt = controller.events;

type D = { msg: string; count: number };
const doc = await crdt.doc<D>({ id: '1', initial: { msg: '', count: 0 } });
await doc.change((doc) => (doc.msg = 'hello'));

/**
 * TODO 🐷
 * - deploy CRDT state to cloud.
 */
console.log('doc', doc.current);
