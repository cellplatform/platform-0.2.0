import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type DetailsProps = {
  style?: t.CssValue;
};

export const Details: React.FC<DetailsProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      width: 360,
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
      MarginX: 60,
    }),
    bodyLeft: css({ textAlign: 'right' }),
    bodyRight: css({ textAlign: 'left' }),
  };

  const hr = <hr {...styles.hr} />;

  const span = (text: string, color: string | number) => <span {...css({ color })}>{text}</span>;
  const dark = (text: string) => span(text, COLORS.DARK);
  const hidden = (text: string) => span(text, Color.alpha(COLORS.DARK, 0));
  const silver = (text: string) => span(text, Color.alpha(COLORS.DARK, 0.3));
  const magenta = (text: string) => span(text, COLORS.MAGENTA);

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.titleName}>{'Rowan Yeoman'}</div>
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
        </div>
        <div {...styles.bodyRight}>
          <div>{hidden('.')}</div>
          <div>{dark('/ro')}</div>
          <div>{dark('/web3')}</div>
        </div>
      </div>
      {hr}
      <div>{'@yeoro'}</div>
    </div>
  );
};
