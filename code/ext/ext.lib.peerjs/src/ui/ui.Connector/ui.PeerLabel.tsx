import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type PeerLabelProps = {
  uri?: string;
  style?: t.CssValue;
};

export const PeerLabel: React.FC<PeerLabelProps> = (props) => {
  const { uri = '' } = props;

  let error = '';

  const [prefix, peerid = ''] = uri.split(':');
  if (!peerid) error = '(error: no peer)';

  const length = 6;
  const hashLeft = peerid.slice(0, length);
  const hashRight = peerid.slice(length);

  console.log('peerid', peerid);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    error: css({ opacity: 0.5 }),
    body: css({
      Flex: 'x-center-start',
    }),
    prefix: css({ minWidth: 32, marginRight: 2 }),
    hashLeft: css({}),
    hashRight: css({ opacity: 0.3 }),
  };

  const elError = error && <div {...styles.error}>{error}</div>;

  const elBody = !error && (
    <div {...styles.body}>
      <div {...styles.prefix}>{`${prefix}:`}</div>
      <div {...styles.hashLeft}>{hashLeft}</div>
      <div {...styles.hashRight}>{hashRight}</div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elError}
      {elBody}
    </div>
  );
};
