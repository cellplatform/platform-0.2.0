import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, FC, rx, type t, Style } from './common';

import { Body } from './ui.Body';
import { Index } from './ui.Index';
import { Empty } from './ui.Empty';

export const View: React.FC<t.RootProps> = (props) => {
  const { slugs = [], selected, vimeo } = props;
  const isEmpty = slugs.length === 0;
  const warning = !vimeo ? '⚠️ Vimeo instance not specified.' : undefined;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      display: 'grid',
      color: COLORS.DARK,
    }),
    body: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
    }),
  };

  const elEmpty = (isEmpty || warning) && <Empty text={warning} />;
  const elBody = !elEmpty && (
    <div {...styles.body}>
      <Index slugs={slugs} selected={selected} onSelect={props.onSelect} />
      <Body slugs={slugs} selected={selected} vimeo={vimeo} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elBody}
    </div>
  );
};
