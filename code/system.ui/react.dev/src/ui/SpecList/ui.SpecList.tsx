import { useEffect, useRef } from 'react';

import { COLORS, css, FC, Filter, t, useRubberband } from './common';
import { Footer } from './ui.Footer';
import { List } from './ui.List';
import { Title } from './ui.Title';
import { useScrollObserver } from './useScrollObserver.mjs';

export type SpecListProps = {
  title?: string;
  version?: string;
  imports?: t.SpecImports;
  selectedIndex?: number;
  filter?: string;
  href?: string;
  hrDepth?: number;
  badge?: t.SpecListBadge;
  allowRubberband?: boolean;
  style?: t.CssValue;
  scroll?: boolean;
  onChildVisibility?: t.SpecListChildVisibilityHandler;
};

const View: React.FC<SpecListProps> = (props) => {
  const { scroll = false } = props;
  const url = new URL(props.href ?? window.location.href);
  const imports = Filter.specs(props.imports, props.filter);

  const baseRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<React.RefObject<HTMLLIElement>[]>([]);
  const itemRef = (index: number) => {
    const refs = itemRefs.current;
    if (refs[index]) return refs[index];
    refs[index] = useRef<HTMLLIElement>(null);
    return refs[index];
  };

  useRubberband(props.allowRubberband ?? false);
  useScrollObserver(baseRef, itemRefs.current, props.onChildVisibility);

  /**
   * [Render]
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
    title: css({ marginBottom: 20 }),
  };

  const elBody = (
    <div {...styles.body}>
      <Title title={props.title} version={props.version} badge={props.badge} style={styles.title} />
      <List
        url={url}
        imports={imports}
        selectedIndex={props.selectedIndex}
        hrDepth={props.hrDepth}
        itemRef={itemRef}
      />
      <Footer />
    </div>
  );

  return (
    <div ref={baseRef} {...css(styles.base, props.style)}>
      {elBody}
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  Filter: typeof Filter;
};
export const SpecList = FC.decorate<SpecListProps, Fields>(
  View,
  { Filter },
  { displayName: 'SpecList' },
);
