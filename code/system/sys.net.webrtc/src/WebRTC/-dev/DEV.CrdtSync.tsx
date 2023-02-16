import { useEffect, useRef, useState } from 'react';
import { Automerge } from 'sys.data.crdt';

import { COLORS, Button, Color, css, Dev, rx, t, Crdt } from './common';

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

type DocRef<D extends {}> = {
  $: t.Observable<{ doc: D; action: 'change' | 'replace' }>;
  current: D;
  change(fn: (doc: D) => void): void;
  replace(doc: D): void;
};

function createDocRef<D extends {}>(): DocRef<D> {
  let _doc: D = Automerge.init<D>();
  const $ = new rx.Subject<{ doc: D; action: 'change' | 'replace' }>();
  return {
    $: $.asObservable(),
    get current() {
      return _doc;
    },
    change(fn) {
      _doc = Automerge.change<D>(_doc, (doc) => fn(doc as D));
      $.next({ doc: _doc, action: 'change' });
    },
    replace(doc) {
      _doc = doc;
      $.next({ doc: _doc, action: 'replace' });
    },
  };
}

function createTestDoc() {
  const doc = createDocRef<Doc>();
  doc.change((d) => {
    d.version = '0.0.0';
    d.count = 0;
    d.peers = [];
  });
  return doc;
}

export type DevCrdtSyncProps = {
  self: t.Peer;
  style?: t.CssValue;
};

export const DevCrdtSync: React.FC<DevCrdtSyncProps> = (props) => {
  const { self } = props;
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
    doc$.subscribe(redraw); // Ensure visual is updated.

    if (conn) {
      const syncer = Crdt.PeerSyncer(
        conn.bus(),
        () => doc.current,
        (doc) => docRef.current.replace(doc),
      );

      doc$.pipe(rx.filter((e) => e.action === 'change')).subscribe((e) => {
        syncer.update();
      });
    }

    return dispose;
  }, [connRef.current?.id]);

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
