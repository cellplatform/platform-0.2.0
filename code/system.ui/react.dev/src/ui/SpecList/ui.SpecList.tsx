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
};

const View: React.FC<SpecListProps> = (props) => {
  const url = new URL(props.href ?? window.location.href);
  const imports = Filter.specs(props.imports, props.filter);

  useRubberband(props.allowRubberband ?? false);

  /**
   * [Render]
   */
  const styles = {
    base: css({
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

  return (
    <div {...css(styles.base, props.style)}>
      <Title title={props.title} version={props.version} badge={props.badge} style={styles.title} />
      <List
        imports={imports}
        url={url}
        selectedIndex={props.selectedIndex}
        hrDepth={props.hrDepth}
      />
      <Footer />
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
