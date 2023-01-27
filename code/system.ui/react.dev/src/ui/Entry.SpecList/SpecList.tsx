import { COLORS, css, t } from './common';
import { Footer } from './ui.Footer';
import { List } from './ui.List';
import { Title } from './ui.Title';

export type SpecListProps = {
  title?: string;
  version?: string;
  imports?: t.Imports;
  href?: string;
  hrDepth?: number;
  badge?: t.SpecListBadge;
  style?: t.CssValue;
};

export const SpecList: React.FC<SpecListProps> = (props) => {
  const { imports = {} } = props;
  const url = new URL(props.href ?? window.location.href);

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
      <List imports={imports} url={url} />
      <Footer />
    </div>
  );
};
