import { useRef } from 'react';

import { COLORS, css, useRubberband, type t } from './common';
import { Footer } from './ui.Footer';
import { List } from './ui.List';
import { Title } from './ui.Title';
import { useScrollController } from './useScrollController.mjs';
import { useScrollObserver } from './useScrollObserver.mjs';

type LiMap = Map<number, HTMLLIElement>;

export const View: React.FC<t.SpecListProps> = (props) => {
  const { scroll = false } = props;
  const url = new URL(props.href ?? window.location.href);
  const imports = props.specs ?? {};

  const baseRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<LiMap>(new Map<number, HTMLLIElement>());

  useRubberband(props.allowRubberband ?? false);
  useScrollObserver(baseRef, itemRefs.current, props.onItemVisibility);
  useScrollController(baseRef, itemRefs.current, props.scrollTo$);

  /**
   * [Handlers]
   */
  const handleItemReadyChange: t.SpecListItemReadyHandler = (e) => {
    const map = itemRefs.current;
    if (e.lifecycle === 'ready') map.set(e.index, e.el!);
    if (e.lifecycle === 'disposed') map.delete(e.index);
  };

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      Scroll: scroll,
      Absolute: scroll ? 0 : undefined,
    }),
    body: css({
      position: 'relative',
      cursor: 'default',
      fontFamily: 'sans-serif',
      lineHeight: '2em',
      color: COLORS.DARK,
      boxSizing: 'border-box',
      padding: 30,
      paddingTop: 20,
    }),
    list: {
      outer: css({ marginTop: 30, display: 'grid' }),
      inner: css({ minWidth: 550, MarginX: 50 }),
    },
    title: css({ marginBottom: 20 }),
  };

  const elList = (
    <div {...styles.list.outer}>
      <div {...styles.list.inner}>
        <List
          url={url}
          imports={imports}
          selectedIndex={props.selectedIndex}
          hrDepth={props.hrDepth}
          showDevParam={props.showDevParam}
          onItemReadyChange={handleItemReadyChange}
          onItemClick={props.onItemClick}
          onItemSelect={props.onItemSelect}
        />
      </div>
    </div>
  );

  const elBody = (
    <div {...styles.body}>
      <Title title={props.title} version={props.version} badge={props.badge} style={styles.title} />
      {elList}
      <Footer />
    </div>
  );

  return (
    <div ref={baseRef} {...css(styles.base, props.style)}>
      {elBody}
    </div>
  );
};
