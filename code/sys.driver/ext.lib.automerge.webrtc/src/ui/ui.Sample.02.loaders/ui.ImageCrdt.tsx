import { Info } from 'ext.lib.automerge';
import { useEffect, useState } from 'react';
import { Image } from 'sys.ui.react.media.image';
import { COLORS, Color, WebStore, css, rx, type t } from './common';

import type { ImageBinary } from 'sys.ui.react.media.image/src/types';
type D = { image?: ImageBinary };

export type ImageCrdtProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const ImageCrdt: React.FC<ImageCrdtProps> = (props) => {
  const { store, docuri } = props;

  const [showDocJson, setShowDocJson] = useState(false);
  const [isOver, setOver] = useState(false);
  const [index, setIndex] = useState<t.WebStoreIndex>();
  const [doc, setDoc] = useState<t.Doc<D>>();
  const [_, setRedraw] = useState(0);

  const redraw = () => setRedraw((n) => n + 1);
  const over = (isOver: boolean) => () => setOver(isOver);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const life = rx.lifecycle();
    WebStore.index(store).then((index) => {
      if (life.disposed) setIndex(index);
    });

    store.doc.get<D>(docuri).then((doc) => {
      if (life.disposed || !doc) return;
      const events = doc.events(life.dispose$);
      events.changed$.pipe(rx.debounceTime(100)).subscribe(redraw);
      setDoc(doc);
    });

    return life.dispose;
  }, [docuri]);

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid', backgroundColor: COLORS.WHITE }),
    left: css({ display: 'grid' }),
    right: {
      base: css({
        Absolute: [0, 0, 0, null],
        width: 280,
        borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
        backgroundColor: Color.alpha(COLORS.WHITE, 0.85),
        // pointerEvents: 'none',
        opacity: isOver ? 1 : 0,
        transition: `opacity 0.3s`,
        backdropFilter: `blur(10px)`,
        display: 'grid',
      }),
      inner: css({
        Absolute: 0,
        Scroll: true,
        Padding: [8, 10, 10, 10],
        display: 'grid',
      }),
    },
  };

  return (
    <div {...css(styles.base, props.style)} onMouseEnter={over(true)} onMouseLeave={over(false)}>
      <div {...styles.left}>
        <Image
          src={doc?.current.image}
          onDropOrPaste={(e) => {
            if (e.isSupported) doc?.change((d) => (d.image = e.file));
          }}
        />
      </div>
      <div {...styles.right.base}>
        <div {...styles.right.inner}>
          <Info
            style={{ marginBottom: 30 }}
            fields={[
              'Repo',
              'Doc',
              'Doc.URI',
              showDocJson ? 'Doc.Object' : undefined,
              'Doc.History',
              'Doc.History.Genesis',
              'Doc.History.List',
            ]}
            data={{
              repo: { store, index },
              document: {
                ref: doc,
                object: { onToggleClick: () => setShowDocJson((prev) => !prev) },
                history: {},
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
