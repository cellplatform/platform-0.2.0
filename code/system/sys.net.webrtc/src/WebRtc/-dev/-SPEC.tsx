import { Automerge, CrdtInfo } from 'sys.data.crdt';

import { WebRtc } from '..';
import {
  Color,
  COLORS,
  Crdt,
  css,
  Delete,
  Dev,
  Filesystem,
  Path,
  rx,
  slug,
  type t,
  TEST,
  TextInput,
} from '../../test.ui';
import { PeerCard, PeerList } from '../../ui';
import { DevSample } from './DEV.Sample';

import type { Doc } from './DEV.CrdtSync';

const DEFAULT = {
  filedir: 'dev:test/WebRtc.SPEC/cell.self',
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

export default Dev.describe('WebRtc', async (e) => {
  e.timeout(9999);

  type LocalStore = { muted: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc');
  const local = localstore.object({ muted: true });

  let self: t.Peer;
  let docFile: t.CrdtDocFile<Doc>;

  const bus = rx.bus();
  const media = WebRtc.Media.singleton({ bus });
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
    self = await WebRtc.peer(TEST.signal, { getStream });
    await state.change((d) => (d.self = self));
    self.connections$.subscribe((e) => state.change((d) => (d.self = self)));
  });

  e.it('init:crdt', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const redraw = () => state.change((d) => d.debug.redraw++);

    const doc = Crdt.Doc.ref<Doc>('doc-id', {
      version: '0.0.0',
      count: 0,
      peers: [],
      code: new Automerge.Text(),
    });
    docFile = await Crdt.Doc.file<Doc>(filedir, doc, { autosave: true });

    const info = await docFile.info();
    console.log('docFile/info', info);

    docFile.doc.$.subscribe(redraw);

    state.change(async (d) => {
      const doc = docFile.doc.current;
      d.main.imageUrl = doc.url ?? '';
      d.main.iframeUrl = doc.iframe ?? '';
      d.main.code = doc.code?.toString() ?? CODE;
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

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.ctx.state<T>(initial);

    const Conn = {
      isSelf(state: T) {
        const remote = WebRtc.Util.asId(state.debug.remotePeer ?? '');
        return remote === self.id;
      },

      canConnect(state: T) {
        const remote = state.debug.remotePeer ?? '';
        return Boolean(remote) && !Conn.isSelf(state);
      },

      async connectData(remote: t.PeerId = '') {
        const conn = await self.data(remote);
        console.info('⚡️ peer.data (response):', conn);
        return conn;
      },

      async connectCamera(remote: t.PeerId = '') {
        const conn = await self.media(remote, 'camera');
        console.info('⚡️ peer.media:camera (response):', conn);
        return conn;
      },

      async connectScreenshare(remote: t.PeerId = '') {
        /**
         * TODO 🐷 - connect screen share
         * - [ ] recieve event notification from Peer display list (UI)
         */
        const conn = await self.media(remote, 'screen');
        console.info('⚡️ peer.media:screen (response):', conn);
        return conn;
      },
    };

    const toggleMute = () => {
      return state.change((d) => {
        const next = !d.debug.muted;
        d.debug.muted = next;
        local.muted = next;
      });
    };

    dev.header
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        return <PeerCard self={self} muted={e.state.debug.muted} onMuteClick={toggleMute} />;
      });

    dev.footer.border(-0.1).render<T>((e) => {
      const { self } = e.state;
      const connections = self?.connections;
      const doc = Dev.trimStringsDeep(docFile.doc.current, { maxLength: 35 });

      const media = {
        '🐷[1]': `refactor bus/events in source module: sys.ui.video`,
      }; // TODO 🐷

      const data = {
        // length: connections?.length ?? 0,
        Peer: { self, connections },
        TestResults: e.state.debug.testrunner.results,
        // MediaStream__TODO__REFACTOR__: media,
        'Doc<T>': doc,
      };
      return (
        <Dev.Object
          name={'WebRtc'}
          data={Delete.undefined(data)}
          // expand={{ paths: ['$', '$.doc'] }}
          fontSize={11}
        />
      );
    });

    // Textbox (Peer ID)
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
          onEnter={() => {
            const id = state.current.debug.remotePeer;
            Conn.connectData(id);
            Conn.connectCamera(id);
          }}
        />
      );
    });

    dev.hr();

    // Peer List 🧠
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
              if (ev.kind === 'data') await Conn.connectData(peerid);
              if (ev.kind === 'media:camera') await Conn.connectCamera(peerid);
              if (ev.kind === 'media:screen') {
                const conn = await Conn.connectScreenshare(peerid);
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

    dev.section('Connection', (dev) => {
      const connectButton = (label: string, fn: t.DevButtonClickHandler<T>) => {
        dev.button((btn) =>
          btn
            .label(`(debug) connect: ${label}`)
            .right((e) => (Conn.isSelf(e.state) ? 'self ⚠️' : ''))
            .enabled((e) => Conn.canConnect(e.state))
            .onClick(fn),
        );
      };

      dev.section(() => {
        connectButton('data', (e) => Conn.connectData(e.state.current.debug.remotePeer));
        connectButton('camera', (e) => Conn.connectCamera(e.state.current.debug.remotePeer));
        connectButton('screen', (e) => Conn.connectScreenshare(e.state.current.debug.remotePeer));

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

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      const increment = (label: string, by: number) => {
        dev.button(label, (e) => docFile.doc.change((d) => (d.count += by)));
      };
      increment('increment', 1);
      increment('decrement', -1);
      dev.hr();
      dev.button('reset text', (e) => {
        docFile.doc.change((d) => d.code.deleteAt(0, d.code.length));
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
              const text = (e.state.main.iframeUrl || '').trim();
              const url = text ? Path.ensureHttpsPrefix(text) : '';
              console.log('url', url);
              docFile.doc.change((d) => (d.iframe = url));
            }}
          />
        );
      });
      dev.hr();
    });

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
              const text = (e.state.main.imageUrl || '').trim();
              const url = text ? Path.ensureHttpsPrefix(text) : '';
              docFile.doc.change((d) => (d.url = url));
            }}
          />
        );
      });
      dev.hr();
    });

    // CRDT (Info)
    dev.section('CRDT (State)', (dev) => {
      dev.row((e) => {
        return <CrdtInfo style={{ Margin: [0, 20] }} />;
      });
    });

    dev.hr();

    // QRCode
    dev.section((dev) => {
      dev.row(async (e) => {
        const { QRCode } = await import('sys.ui.react.common');

        const peerId = self.id;
        // const value = WebRtc.Util.asUri(peerId);
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
  });
});
