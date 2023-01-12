import { Color, COLORS, css, t, rx } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type DetailsProps = {
  style?: t.CssValue;
};

export const Details: React.FC<DetailsProps> = (props) => {
  const media = Wrangle.mediaFromUrl(location.href);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      fontSize: 22,
    }),
    titleName: css({
      fontWeight: 'bold',
      fontSize: 28,
    }),
    hr: css({
      border: 'none',
      borderTop: `solid 8px ${Color.alpha(COLORS.DARK, 0.1)}`,
      MarginY: 20,
    }),
    body: css({
      display: 'grid',
      gridTemplateColumns: `repeat(2, 1fr)`,
      lineHeight: '1.35em',
      paddingLeft: 20,
    }),
    bodyLeft: css({ textAlign: 'right' }),
    bodyRight: css({ textAlign: 'left' }),
  };

  const hr = <hr {...styles.hr} />;

  const span = (text: string, color: string) => <span {...css({ color })}>{text}</span>;
  const dark = (text: string) => span(text, COLORS.DARK);
  const hidden = (text: string) => span(text, Color.alpha(COLORS.DARK, 0));
  const silver = (text: string) => span(text, Color.alpha(COLORS.DARK, 0.3));
  const magenta = (text: string) => span(text, COLORS.MAGENTA);

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.titleName}>{media.name}</div>
      {hr}
      <div {...styles.body}>
        <div {...styles.bodyLeft}>
          <div>
            {magenta('rowan')}
            {silver('@')}
            {dark('db.team')}
          </div>
          <div>{silver('db.team')}</div>
          <div>{silver('db.team')}</div>
          <div>{silver('db.team')}</div>
        </div>
        <div {...styles.bodyRight}>
          <div>{hidden('.')}</div>
          <div>{dark('/ro')}</div>
          <div>{dark('/web3')}</div>
          <div>{dark('/undp')}</div>
        </div>
      </div>
      {/* {hr} */}
    </div>
  );
};
