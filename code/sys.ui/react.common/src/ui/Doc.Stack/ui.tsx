import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const View: React.FC<t.DocStackProps> = (props) => {
  const { pages = [], total = DEFAULTS.props.total, height = DEFAULTS.props.height } = props;

  /**
   * Render
   */
  const t = (prop: string, time: t.Msecs = 50) => `${prop} ${time}ms`;
  const transition = [t('opacity')].join(', ');
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      height,
    }),

    page: css({
      height,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      transition,
      border: `solid 1px ${Color.alpha(theme.fg, 0.9)}`,
      borderBottom: 'none',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    }),
  };

  const elPage = <div {...styles.page}></div>;

  return <div {...css(styles.base, props.style)}>{elPage}</div>;
};
