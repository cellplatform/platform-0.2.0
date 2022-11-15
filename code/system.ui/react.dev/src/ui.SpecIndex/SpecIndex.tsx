import { Color, COLORS, css, t } from '../common';

const KEY = { DEV: 'dev' };

export type Imports = { [namespace: string]: () => Promise<any> };

export type SpecIndexProps = {
  title?: string;
  version?: string;
  imports?: Imports;
  style?: t.CssValue;
};

export const SpecIndex: React.FC<SpecIndexProps> = (props) => {
  const { imports = {} } = props;
  const url = new URL(window.location.href);
  const hasDevParam = url.searchParams.has(KEY.DEV);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      fontFamily: 'sans-serif',
      lineHeight: '2em',
      padding: 30,
      color: COLORS.DARK,
    }),
    title: css({ fontWeight: 'bold' }),
    version: css({
      color: Color.alpha(COLORS.DARK, 0.3),
      marginLeft: 3,
    }),
    ul: css({}),
    hr: css({
      border: 'none',
      borderTop: `dashed 1px ${Color.alpha(COLORS.DARK, 0.4)}`,
    }),
    a: css({
      color: COLORS.BLUE,
      textDecoration: 'none',
    }),
  };

  const createItem = (i: number, address: string | undefined, title?: string) => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (address) params.set(KEY.DEV, address);
    if (!address) params.delete(KEY.DEV);
    return (
      <li key={i}>
        <a href={url.href} {...styles.a}>
          {address ?? title}
        </a>
      </li>
    );
  };

  const elTitle = props.title && (
    <div {...styles.title}>
      <span>{props.title}</span>
      {props.version && <span {...styles.version}>{`@${props.version}`}</span>}
    </div>
  );

  const elList = (
    <ul {...styles.ul}>
      {Object.keys(imports).map((key, i) => createItem(i, key))}
      {hasDevParam && <hr {...styles.hr} />}
      {hasDevParam && createItem(-1, undefined, 'clear - ?dev')}
    </ul>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elTitle}
      {elList}
    </div>
  );
};
