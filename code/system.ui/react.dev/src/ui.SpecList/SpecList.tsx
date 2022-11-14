import { COLORS, css, FC, t } from '../common';

export type Imports = { [namespace: string]: () => Promise<any> };

export type SpecListProps = {
  title?: string;
  imports?: Imports;
  style?: t.CssValue;
};

export const SpecList: React.FC<SpecListProps> = (props) => {
  const { imports = {} } = props;

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
    title: css({
      fontWeight: 'bold',
    }),
    a: css({
      color: COLORS.BLUE,
      textDecoration: 'none',
    }),
  };

  const elItems = Object.keys(imports).map((key, i) => {
    const url = new URL(window.location.href);
    url.searchParams.set('dev', key);

    return (
      <li key={i}>
        <a href={url.href} {...styles.a}>
          {key}
        </a>
      </li>
    );
  });

  const elTitle = props.title && <div {...styles.title}>{props.title}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elTitle}
      <ul>{elItems}</ul>
    </div>
  );
};
