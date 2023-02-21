import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type TempProps = {
  style?: t.CssValue;
};

export const Temp: React.FC<TempProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: COLORS.WHITE,
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
    }),
    img: css({
      width: 300,
      borderRadius: 30,
    }),
  };

  const URL = {
    James:
      'https://user-images.githubusercontent.com/185555/220016670-81aa56f2-62ad-405f-bb01-0af880ff698e.png',
    Rowan1:
      'https://user-images.githubusercontent.com/185555/220252359-3fe11a5d-b59f-4dd4-a681-b6dc0e88ecd2.png',
    Rowan2:
      'https://user-images.githubusercontent.com/185555/220252528-49154284-88e2-46aa-9544-2dff1c7a44a8.png',
  };

  return (
    <div {...css(styles.base, props.style)}>
      <a href={'https://dev.db.team/?dev=sys.net.webrtc'}>
        <img src={URL.Rowan1} {...styles.img} />
      </a>
    </div>
  );
};
