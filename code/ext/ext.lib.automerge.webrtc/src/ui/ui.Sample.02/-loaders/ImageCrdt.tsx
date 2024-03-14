import { useEffect, useState } from 'react';
import { Image } from 'sys.ui.react.media.image';
import { COLORS, Color, css, rx, type t } from './-common';

import { ImageBinary } from 'sys.ui.react.media.image/src/types';

type TDoc = { image?: ImageBinary };

export type ImageCrdtProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const ImageCrdt: React.FC<ImageCrdtProps> = (props) => {
  const { store, docuri } = props;

  const [doc, setDoc] = useState<t.DocRef<TDoc>>();
  const [_, setRedraw] = useState(0);
  const redraw = () => setRedraw((n) => n + 1);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const life = rx.lifecycle();

    store.doc.get<TDoc>(docuri).then((doc) => {
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
    base: css({ display: 'grid', gridTemplateColumns: '1fr auto' }),
    left: css({ display: 'grid' }),
    right: css({
      display: 'grid',
      borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.08)}`,
      width: 200,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <Image
          src={doc?.current.image}
          onDropOrPaste={(e) => {
            console.info('⚡️ onDropOrPaste:', e);
            if (!e.isSupported) return;

            if (e.isSupported && doc) {
              // state.change((d) => (d.props.src = e.file));
              // if (crdt && e.file) crdt.update(e.file);
              doc.change((d) => (d.image = e.file));
            }
          }}
        />
      </div>
      <div {...styles.right}>{`🐷 right`}</div>
    </div>
  );
};
