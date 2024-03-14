import { useEffect, useState } from 'react';

import { Info } from 'ext.lib.automerge';
import { Image } from 'sys.ui.react.media.image';
import { COLORS, Color, WebStore, css, rx, type t } from './common';

import type { ImageBinary } from 'sys.ui.react.media.image/src/types';
type TDoc = { image?: ImageBinary };

export type ImageCrdtProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const ImageCrdt: React.FC<ImageCrdtProps> = (props) => {
  const { store, docuri } = props;

  const [index, setIndex] = useState<t.WebStoreIndex>();
  const [doc, setDoc] = useState<t.DocRef<TDoc>>();
  const [_, setRedraw] = useState(0);
  const redraw = () => setRedraw((n) => n + 1);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const life = rx.lifecycle();
    WebStore.index(store).then((index) => {
      if (life.disposed) setIndex(index);
    });

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
      width: 260,
      Padding: [8, 10],
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <Image
          src={doc?.current.image}
          onDropOrPaste={(e) => {
            if (e.isSupported) doc?.change((d) => (d.image = e.file));
          }}
        />
      </div>
      <div {...styles.right}>
        <Info
          fields={['Repo', 'Doc', 'Doc.URI']}
          data={{ repo: { store, index }, document: { doc } }}
        />
      </div>
    </div>
  );
};
