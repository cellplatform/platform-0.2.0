import { useEffect, useRef, useState } from 'react';
import { Automerge } from 'sys.data.crdt';

import { Filesize, COLORS, Button, Color, css, Dev, rx, t, Crdt } from './common';

const DEFAULT = {
  dir: 'dev:test-data/myfile.crdt',
  filename: 'data.crdt',
};

/**
 * Schema:
 * TODO: make a "zod" based sys toolkit for 2-way building of: *
 *    - type schemas (via zod API)
 *    - type definitions (via typescript)
 */

type Semver = string;
type Doc = {
  version: Semver;
  name?: string;
  count: number;
  peers: string[];
};

function createTestDoc() {
  return Crdt.DocRef.init<Doc>({
    version: '0.0.0',
    count: 0,
    peers: [],
  });
}

export type DevCrdtSyncProps = {
  self: t.Peer;
  fs: t.Fs;
  style?: t.CssValue;
};

export const DevCrdtSync: React.FC<DevCrdtSyncProps> = (props) => {
  const { self, fs } = props;
  const connRef = useRef<t.PeerDataConnection>();
  const docRef = useRef(createTestDoc());
  const doc = docRef.current;

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    self.connections$
      .pipe(
        rx.takeUntil(dispose$),
        rx.filter((e) => e.kind === 'data'),
      )
      .subscribe((e) => {
        const conn = e.action === 'added' ? (e.subject as t.PeerDataConnection) : undefined;
        connRef.current = conn;
      });

    return dispose;
  }, [self.id]);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    const conn = connRef.current;
    const doc = docRef.current;

    const doc$ = doc.$.pipe(rx.takeUntil(dispose$));
    const changed$ = doc$.pipe(rx.filter((e) => e.action === 'change'));
    doc$.subscribe(redraw); // Ensure visual is updated.

    if (conn) {
      const dir = fs.dir(DEFAULT.dir);
      const syncer = Crdt.PeerSyncer(
        conn.bus(),
        () => doc.current,
        (doc) => docRef.current.replace(doc),
        { dir },
      );

      changed$.subscribe((e) => syncer.update());
    }

    changed$.pipe(rx.debounceTime(300)).subscribe(async (e) => {
      const dir = fs.dir(DEFAULT.dir);
      const path = DEFAULT.filename;

      console.log('exists (before):', await dir.exists(path));

      const data = Automerge.save(doc.current);
      await dir.write(path, data);
      const m = await dir.manifest();

      console.log('saved', data);
      console.log('exists (after):', await dir.exists(path));

      console.log('manifest:');
      m.files.forEach((file) => {
        const size = Filesize(file.bytes);
        console.info(` - file: ${file.path} | #${file.filehash.slice(-6)} - ${size}`);
      });
    });

    return dispose;
  }, [connRef.current?.id]);

  /**
   * TODO 🐷 TMP
   */
  useEffect(() => {
    (async () => {
      const dir = fs.dir(DEFAULT.dir);
      const path = DEFAULT.filename;

      //       console.group('🌳 init');
      //       console.log('path', path);
      //       console.log('exists', await fs.exists(path));
      //
      //       console.groupEnd();

      if (await fs.exists(path)) {
        const data = await dir.read(path);
        console.log('INITIAL (saved)', data);
      }

      //
    })();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      padding: 3,
      boxSizing: 'border-box',
      // borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.2)}`,
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
    }),
    title: css({
      marginBottom: 5,
      Padding: [4, 10],
      backgroundColor: Color.alpha(COLORS.DARK, 0.4),
      color: COLORS.WHITE,
      // border: `solid 1px ${Color.alpha(COLORS.DARK, 0.03)}`,
    }),
    body: css({
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
      gridTemplateColumns: 'auto 30px 1fr',
      padding: 8,
    }),
    buttons: css({
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      Padding: [0, 5],
    }),
    info: css({
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  const elCountButtons = (
    <div {...styles.buttons}>
      <Button onClick={() => docRef.current.change((d) => (d.count += 1))}>Increment</Button>
      {` | `}
      <Button onClick={() => docRef.current.change((d) => (d.count -= 1))}>Decrement</Button>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>{'CRDT: PeerSync'}</div>
      <div {...styles.body}>
        {elCountButtons}
        <div />
        <div>
          <Dev.Object name={'doc'} data={doc.current} expand={2} />
        </div>
        <div {...styles.buttons}></div>
      </div>
    </div>
  );
};
