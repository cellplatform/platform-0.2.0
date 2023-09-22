import { Peer } from './Peer';

const Import = {
  Repo: () => import('@automerge/automerge-repo'),
  MessageChannel: () => import('@automerge/automerge-repo-network-messagechannel'),
  RepoContext: () => import('@automerge/automerge-repo-react-hooks'),
} as const;

type Url = string | URL;
let _workerUrl: Url = '';

/**
 * Singleton state related to the [SharedWorker].
 */
const WorkerSingleton = {
  get url(): Url {
    return _workerUrl;
  },
  register(url: Url) {
    _workerUrl = url;
  },
} as const;

/**
 * Sample:
 *  https://github.com/automerge/automerge-repo/blob/main/examples/automerge-repo-demo-counter
 */
export const Repo = {
  worker: WorkerSingleton,

  /**
   * Configure a repo to run on the browser with a [SharedWorker].
   *
   * 🌳
   * The network & storage is run in a separate file and the tabs themselves are stateless and lightweight.
   * This means we only ever create one websocket connection to the sync server, we only do our writes in one place
   * (no race conditions) and we get local real-time sync without the overhead of broadcast channel.
   * The downside is that to debug any problems with the sync server you'll need to find the shared-worker and inspect it.
   *
   * 🐷
   * In Chrome-derived browsers the URL is:
   *    chrome://inspect/#workers
   *
   * In Firefox:
   *    about:debugging#workers
   *
   * In Safari:
   *    Develop > Show Web Inspector > Storage > IndexedDB > automerge-repo-demo-counter.
   *
   */
  async ui(workerUrl?: Url) {
    const { Repo } = await Import.Repo();
    const { MessageChannelNetworkAdapter } = await Import.MessageChannel();
    const { RepoContext: Context } = await Import.RepoContext();

    const url = workerUrl || WorkerSingleton.url;
    const worker = new SharedWorker(url, {
      type: 'module',
      name: 'automerge-repo-shared-worker',
    });

    if (!url) {
      const msg = `Ensure the [Repo.worker.register(url)] has been called for the shared-worker.`;
      throw new Error(msg);
    }

    /**
     * Create a repo and share any documents we create with our
     * local in-browser storage worker.
     */
    const repo = new Repo({
      network: [new MessageChannelNetworkAdapter(worker.port)],
      sharePolicy: async (peerId) => Peer.id.is('SharedWorker', peerId),
    });

    /**
     * The configured context <Provider> closure.
     */
    const Provider: React.FC<{ children?: React.ReactNode }> = (props) => {
      return <Context.Provider value={repo}>{props.children}</Context.Provider>;
    };

    /**
     * API
     */
    return {
      repo,
      Provider,
      workerUrl: url,
    } as const;
  },
} as const;

/**
 * Helpers
 */
export const Wrangle = {
  get global() {
    const key = 'ext.driver.automerge';
    const win = window as any;
    return win[key] || (win[key] = {});
  },
} as const;
