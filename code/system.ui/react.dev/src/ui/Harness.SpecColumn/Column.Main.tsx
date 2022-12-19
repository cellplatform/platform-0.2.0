import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, useCurrentState } from '../common';

export type SpecColumnMainProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const SpecColumnMain: React.FC<SpecColumnMainProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, { distinctUntil });
  const render = current.info?.render;
  if (!render) return null;

  const state = render.state;
  const renderers = render.props?.debug.main.renderers ?? [];

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    item: css({
      position: 'relative',
    }),
  };

  const elements = renderers.filter(Boolean).map((renderer, i) => {
    return (
      <div key={i} {...styles.item}>
        {renderer({ state })}
      </div>
    );
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};

/**
 * [Helpers]
 */

const tx = (e: t.DevInfoChanged) => e.info.run.results?.tx;
const distinctUntil = (prev: t.DevInfoChanged, next: t.DevInfoChanged) => {
  if (tx(prev) !== tx(next)) return false;
  return true;
};
