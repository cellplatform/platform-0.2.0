import { useEffect, useRef } from 'react';

import { COLORS, css, Filter, t, useRubberband, FC } from './common';
import { Footer } from './ui.Footer';
import { List } from './ui.List';
import { Title } from './ui.Title';

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

  useRubberband(props.allowRubberband ?? false);

  const baseRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<React.RefObject<HTMLLIElement>[]>([]);
  const itemRef = (index: number) => {
    const refs = itemRefs.current;
    if (refs[index]) return refs[index];
    refs[index] = useRef<HTMLLIElement>(null);
    return refs[index];
  };

  useEffect(() => {
    let observer: IntersectionObserver;
    const root = baseRef.current;
    const rootMargin = '0px';
    const threshold = 1.0;

    const map = new Map<number, SpecListChildVisibility>();
    const refs = itemRefs.current;

    if (root) {
      const options = { root, rootMargin, threshold };
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLLIElement;
          const index = refs.findIndex((ref) => ref.current === el);
          const isIntersecting = entry.isIntersecting;

          map.set(index, { index, isIntersecting });
        });

        const items = Array.from(map.values());
        props.onChildVisibility?.({ items });
      }, options);

      refs.forEach((ref) => {
        if (ref.current) observer.observe(ref.current);
      });
    }

    return () => {
      observer?.disconnect();
    };
  }, [itemRefs.current.length]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Scroll: scroll,
      Absolute: scroll ? 0 : undefined,
    }),
    body: css({
      position: 'relative',
      cursor: 'default',
      fontFamily: 'sans-serif',
      lineHeight: '2em',
      color: COLORS.DARK,
      padding: 30,
      paddingTop: 20,
    }),
    title: css({ marginBottom: 20 }),
  };

  const elBody = (
    <div {...styles.body}>
      <Title title={props.title} version={props.version} badge={props.badge} style={styles.title} />
      <List
        imports={imports}
        url={url}
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
