import { CrdtInfo } from 'sys.data.crdt';

import { WebRTC } from '.';
import {
  Color,
  COLORS,
  Crdt,
  css,
  Delete,
  Dev,
  Filesystem,
  rx,
  slug,
  t,
  TEST,
  TextInput,
} from '../test.ui';
import { PeerList, PeerVideo } from '../ui';
import { DevSample } from './-dev/DEV.Sample';

import type { Doc } from './-dev/DEV.CrdtSync';

const DEFAULT = {
  filedir: 'dev:test/WebRTC.SPEC/cell.self',
};

type T = {
  self?: t.Peer;
  main: {
    media?: MediaStream;
    imageUrl?: string;
    iframeUrl?: string;
    code?: string;
  };
  debug: {
    redraw: number;
    remotePeer?: t.PeerId;
    testrunner: { spinning?: boolean; results?: t.TestSuiteRunResponse | null };
    muted: boolean;
  };
};
const initial: T = {
  self: undefined,
  main: {},
  debug: {
    redraw: 0,
    remotePeer: '',
    muted: location.hostname === 'localhost',
    testrunner: {},
  },
};

const URL = {
  OVERLAY:
    'https://user-images.githubusercontent.com/185555/219933748-4d500e20-621f-4f5e-b977-c2ba6781b1db.png',
  PHIL: 'https://user-images.githubusercontent.com/185555/219934836-64c108d9-6c70-4668-ae4b-1649efb7c20e.png',
};

const CODE = `
/**
 * system.network.webrtc
 * 
 * Peer-to-peer network tooling
 * (realtime network streams: data/video:audio).
 * 
 * Runtime:  browser
 * Standard: https://www.w3.org/TR/webrtc/
 * 
 * Concepts: 
 *  - Distributed EventBus
 *  - Stream types: Data/Media
 */

`.substring(1);

export default Dev.describe('WebRTC', async (e) => {
  e.timeout(9999);

  type LocalStore = { muted: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc');
  const local = localstore.object({ muted: true });

  let self: t.Peer;
  let docFile: t.CrdtDocFile<Doc>;

  const bus = rx.bus();
  const media = WebRTC.Media.singleton({ bus });
  const streamRef = `sample.${slug()}`;
  const fs = (await Filesystem.client({ bus })).fs;
  const filedir = fs.dir(DEFAULT.filedir);

  e.it('init:webrtc', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => (d.debug.muted = local.muted));

    /**
     * WebRTC (network).
     */
    const { getStream } = media;
    self = await WebRTC.peer(TEST.signal, { getStream });
    await state.change((d) => (d.self = self));
    self.connections$.subscribe((e) => state.change((d) => (d.self = self)));
  });

  e.it('init:crdt', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const redraw = () => state.change((d) => d.debug.redraw++);

    docFile = await Crdt.Doc.file<Doc>(
      filedir,
      { version: '0.0.0', count: 0, peers: [] },
      { autosave: true },
    );

    const info = await docFile.info();
    console.log('docFile/info', info);

    docFile.doc.$.subscribe(redraw);

    state.change(async (d) => {
      const doc = docFile.doc.current;
      d.main.imageUrl = doc.url ?? '';
      d.main.iframeUrl = doc.iframe ?? '';
      d.main.code = doc.code ?? CODE;
    });
  });

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .backgroundColor(1)
      .size('fill')
      .render<T>(async (e) => {
        return <DevSample self={self} docFile={docFile} testrunner={e.state.debug.testrunner} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.ctx.state<T>(initial);

    dev.header
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        return (
          <PeerVideo
            self={self}
            mediaHeight={250}
            muted={e.state.debug.muted}
            onMuteClick={() => {
              state.change((d) => {
                const next = !d.debug.muted;
                d.debug.muted = next;
                local.muted = next;
              });
            }}
          />
        );
      });

    dev.footer.border(-0.1).render<T>((e) => {
      const { self } = e.state;
      const connections = self?.connections;

      const doc = structuredClone(docFile.doc.current);
      Object.entries(doc).forEach(([key, value]) => {
        const MAX = 35;
        if (typeof value === 'string' && value.length > MAX) {
          (doc as any)[key] = `${value.slice(0, MAX)}...`;
        }
      });

      const media = {
        '🐷[1]': `refactor bus/events in source module: sys.ui.video`,
      }; // TODO 🐷

      const data = {
        // length: connections?.length ?? 0,
        Peer: { self, connections },
        TestResults: e.state.debug.testrunner.results,
        // MediaStream__TODO__REFACTOR__: media,
        doc,
      };
      return (
        <Dev.Object
          name={'WebRTC'}
          data={Delete.undefined(data)}
          expand={{ paths: ['$', '$.doc'] }}
          fontSize={11}
        />
      );
    });

    // Remote Peer (Connect)
    dev.section((dev) => {
      dev.row((e) => {
        return (
          <TextInput
            value={e.state.debug.remotePeer}
            valueStyle={{ fontSize: 14 }}
            placeholder={'paste remote peer'}
            placeholderStyle={{ opacity: 0.3, italic: true }}
            focusAction={'Select'}
            spellCheck={false}
            onChanged={(e) => dev.change((d) => (d.debug.remotePeer = e.to))}
            onEnter={async () => {
              const id = state.current.debug.remotePeer;
              connectData(id);
              connectCamera(id);
            }}
          />
        );
      });

      dev.hr();

      const isSelf = (state: T) => {
        const remote = WebRTC.Util.asId(state.debug.remotePeer ?? '');
        return remote === self.id;
      };

      const canConnect = (state: T) => {
        const remote = state.debug.remotePeer ?? '';
        return Boolean(remote) && !isSelf(state);
      };

      const connectData = async (remote: t.PeerId = '') => {
        const conn = await self.data(remote);
        console.info('⚡️ peer.data (response):', conn);
        return conn;
      };

      const connectCamera = async (remote: t.PeerId = '') => {
        const conn = await self.media(remote, 'camera');
        console.info('⚡️ peer.media:camera (response):', conn);
        return conn;
      };

      const connectScreenshare = async (remote: t.PeerId = '') => {
        /**
         * TODO 🐷 - connect screen share
         * - [ ] recieve event notification from Peer display list (UI)
         */
        const conn = await self.media(remote, 'screen');
        console.info('⚡️ peer.media:screen (response):', conn);
        return conn;
      };

      dev.row((e) => {
        const totalPeers = self.connectionsByPeer.length;
        if (totalPeers === 0) return;

        const styles = {
          base: css({
            position: 'relative',
            marginTop: 10,
          }),
          list: css({ marginLeft: 20, marginRight: 10 }),
          hrBottom: css({
            borderBottom: `solid 5px ${Color.alpha(COLORS.DARK, 0.1)}`,
            marginTop: 30,
            marginBottom: 20,
          }),
        };

        const showConnection = (id: t.PeerConnectionId) => {
          const conn = self.connections.media.find((item) => item.id === id);
          const stream = conn?.stream.remote || conn?.stream.local;
          state.change((d) => (d.main.media = stream));
        };

        return (
          <div {...styles.base}>
            <PeerList
              self={self}
              style={styles.list}
              onConnectRequest={async (ev) => {
                const peerid = state.current.debug.remotePeer;
                if (ev.kind === 'data') await connectData(peerid);
                if (ev.kind === 'media:camera') await connectCamera(peerid);
                if (ev.kind === 'media:screen') {
                  const conn = await connectScreenshare(peerid);
                  console.info('conn', conn);
                  showConnection(conn.id);
                }
              }}
              onDisplayConnRequest={(ev) => {
                showConnection(ev.connection);
              }}
            />
            <div {...styles.hrBottom} />
          </div>
        );
      });

      dev.section((dev) => {
        const connectButton = (label: string, fn: t.DevButtonClickHandler<T>) => {
          dev.button((btn) =>
            btn
              .label(`(debug) connect: ${label}`)
              .right((e) => (isSelf(e.state) ? 'self ⚠️' : ''))
              .enabled((e) => canConnect(e.state))
              .onClick(fn),
          );
        };

        dev.title('Connection');
        dev.section(() => {
          connectButton('data', (e) => connectData(e.state.current.debug.remotePeer));
          connectButton('camera', (e) => connectCamera(e.state.current.debug.remotePeer));
          connectButton('screen', (e) => connectScreenshare(e.state.current.debug.remotePeer));

          dev.hr();
          dev.section(() => {
            dev.button((btn) =>
              btn
                .label('close all connections')
                .enabled((e) => Boolean(self.connections.length > 0))
                .onClick(async (e) => {
                  self.connections.all.forEach((conn) => conn.dispose());
                  await media.events.stop(streamRef).fire();
                }),
            );
          });
        });
      });
    });

    dev.hr(5, 20);
    dev.section('Debug', (dev) => {
      const increment = (label: string, by: number) => {
        dev.button(label, (e) => docFile.doc.change((d) => (d.count += by)));
      };
      increment('increment', 1);
      increment('decrement', -1);
    });

    // QRCode
    dev.section((dev) => {
      dev.row(async (e) => {
        const { QRCode } = await import('sys.ui.react.common');

        const peerId = self.id;
        // const value = WebRTC.Util.asUri(peerId);
        // const value = URL.PHIL;
        const value = e.state.main.imageUrl;

        const styles = {
          base: css({
            marginTop: 20,
            display: 'grid',
            placeItems: 'center',
          }),
        };
        return (
          <div {...styles.base}>
            <QRCode value={value} size={180} />
          </div>
        );
      });
    });

    dev.hr();

    // ImageUrl
    dev.section((dev) => {
      dev.row((e) => {
        return (
          <TextInput
            value={e.state.main.imageUrl}
            valueStyle={{ fontSize: 14 }}
            placeholder={'image'}
            placeholderStyle={{ opacity: 0.3, italic: true }}
            focusAction={'Select'}
            spellCheck={false}
            onChanged={(e) => dev.change((d) => (d.main.imageUrl = e.to))}
            onEnter={() => {
              const url = e.state.main.imageUrl ?? '';
              docFile.doc.change((d) => (d.url = url));
            }}
          />
        );
      });
    });

    dev.hr();

    // IFrameURL
    dev.section((dev) => {
      dev.row((e) => {
        return (
          <TextInput
            value={e.state.main.iframeUrl}
            valueStyle={{ fontSize: 14 }}
            placeholder={'iframe'}
            placeholderStyle={{ opacity: 0.3, italic: true }}
            focusAction={'Select'}
            spellCheck={false}
            onChanged={(e) => dev.change((d) => (d.main.iframeUrl = e.to))}
            onEnter={() => {
              const url = e.state.main.iframeUrl ?? '';
              docFile.doc.change((d) => (d.iframe = url));
            }}
          />
        );
      });
    });

    dev.hr();

    // CRDT (Info)
    dev.section('CRDT (State)', (dev) => {
      dev.row((e) => {
        return <CrdtInfo style={{ Margin: [0, 20] }} />;
      });
    });
  });
});
