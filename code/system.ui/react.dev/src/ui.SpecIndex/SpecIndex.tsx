import { COLORS, css, t } from '../common';

const KEY = { DEV: 'dev' };

export type Imports = { [namespace: string]: () => Promise<any> };

export type SpecIndexProps = {
  title?: string;
  imports?: Imports;
  style?: t.CssValue;
};

export const SpecIndex: React.FC<SpecIndexProps> = (props) => {
  const { imports = {} } = props;
  const url = new URL(window.location.href);

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

  const elTitle = props.title && <div {...styles.title}>{props.title}</div>;
  const elList = (
    <ul>
      {Object.keys(imports).map((key, i) => createItem(i, key))}
      {url.searchParams.has(KEY.DEV) && createItem(-1, undefined, '(clear)')}
    </ul>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elTitle}
      {elList}
    </div>
  );
};
