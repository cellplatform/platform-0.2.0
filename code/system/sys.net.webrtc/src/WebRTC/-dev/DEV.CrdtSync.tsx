import { useEffect, useRef, useState } from 'react';
import { Button, Color, COLORS, Crdt, css, Dev, rx, t } from './common';

/**
 * Schema:
 * TODO: make a "zod" based sys toolkit for 2-way building of: *
 *    - type schemas (via zod API)
 *    - type definitions (via typescript)
 */

export type Doc = {
  version: string;
  name?: string;
  count: number;
  peers: string[];
  url?: string;
};

export type DevCrdtSyncProps = {
  self: t.Peer;
  docFile: t.CrdtDocFile<Doc>;
  style?: t.CssValue;
};

export const DevCrdtSync: React.FC<DevCrdtSyncProps> = (props) => {
  const { self, docFile } = props;
  const connRef = useRef<t.PeerDataConnection>();

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

    const doc$ = docFile.doc.$.pipe(rx.takeUntil(dispose$));
    const changed$ = doc$.pipe(rx.filter((e) => e.action === 'change'));
    doc$.subscribe(redraw); // Ensure visual is updated.

    if (conn) {
      console.log('start syncer');

      const syncer = Crdt.PeerSyncer(
        conn.bus(),
        () => docFile.doc.current,
        (doc) => {
          console.log('update (sync)', doc);
          docFile.doc.replace(doc);
        },
        // { dir },
      );

      changed$.subscribe((e) => syncer.update());
      syncer.update();
    }

    changed$.pipe(rx.debounceTime(300)).subscribe(async (e) => {
      await docFile.save();
    });

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
      <Button onClick={() => docFile.doc.change((d) => (d.count += 1))}>Increment</Button>
      {` | `}
      <Button onClick={() => docFile.doc.change((d) => (d.count -= 1))}>Decrement</Button>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>{'CRDT: PeerSync'}</div>
      <div {...styles.body}>
        {elCountButtons}
        <div />
        <div>
          <Dev.Object name={'doc'} data={docFile.doc.current} expand={2} />
        </div>
        <div {...styles.buttons}></div>
      </div>
    </div>
  );
};
