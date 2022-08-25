import { t } from '../common/index.mjs';

type FilesystemId = string;
type Milliseconds = number;

export function MockBusController(args: {
  bus: t.EventBus<any>;
  driver: t.FsDriverLocal;
  id?: FilesystemId;
  index?: t.FsIndexer;
  filter?: (e: t.SysFsEvent) => boolean;
  // httpFactory?: (host: string | number) => t.IHttpClient;
  timeout?: Milliseconds;
}) {
  const { bus, id, filter, timeout } = args;

  /**
   * NOTE:
   *      Use the supplied `FsDriver` or create a new instance of the
   *      driver using the [node-js] implementation as the provider.
   */
  //  const driver =
  //  typeof args.driver === 'string' ? FsDriverLocal({ dir: args.driver, fs: nodefs }) : args.driver;

  /**
   * NOTE:
   *      Use the supplied [FsIndexer] or create a new instance of the
   *      indexer using [node-js] implementation as the provider.
   */
  // const index = args.index ?? FsIndexerLocal({ dir: driver.dir, fs: nodefs });

  /**
   * TODO 🐷
   */
}
