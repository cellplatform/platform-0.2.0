import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

export type RootHoldingProps = {
  style?: t.CssValue;
};

export const RootHolding: React.FC<RootHoldingProps> = (props) => {
  const detail = `
    This report is in the final stages of edits and review for its 1.0 release.
    After the initial 1.0 release it will remain on a regular update cycle reflecting
    emerging changes within this nascent and fast evolving space.
  `;

  const licence = {
    title: 'CC BY 4.0',
    link: 'https://creativecommons.org/licenses/by/4.0/',
  };

  /**
   * [Render]
   */
  const styles = {
    normalize: css({ fontFamily: 'sans-serif', color: COLORS.DARK }),
    base: css({ Absolute: 0, Flex: 'y-center-center' }),
    body: {
      base: css({
        Flex: 'x-center-center',
        marginBottom: '5%',
      }),
      inner: css({
        PaddingY: 50,
        width: 600,
        border: `solid 1px ${Color.alpha(COLORS.DARK, 0.06)}`,
        borderTop: 'none',
        borderBottom: 'none',
        '@media (max-width: 660px)': { width: 335 },
      }),
    },
    slash: css({ color: COLORS.DARK, MarginX: 7, opacity: 0.12 }),
    cyan: css({ color: COLORS.CYAN }),
    title: {
      base: css({
        Flex: 'x-spaceBetween-stretch',
        borderBottom: `solid 6px ${COLORS.CYAN}`,
        paddingBottom: 50,
        '@media (max-width: 660px)': { Flex: 'y-stretch-stretch' },
      }),
      path: css({ fontSize: 32, fontWeight: 'bold' }),
      version: css({ fontSize: 32 }),
    },
    detail: css({ lineHeight: 1.7, fontSize: 16 }),
    a: css({ color: COLORS.CYAN, textDecoration: 'none' }),
  };

  const slash = (char = '/') => <span {...styles.slash}>{char}</span>;
  const cyan = (text: string) => <span {...styles.cyan}>{text}</span>;

  const elTitle = (
    <div {...styles.title.base}>
      <div {...styles.title.path}>
        {'db.team'}
        {slash('/')}
        {cyan('undp')}
        {slash('/')}
        {cyan('web3')}
      </div>
      <div {...styles.title.version}>{'0.0.0-draft.6'}</div>
    </div>
  );

  const elCC = (
    <a {...styles.a} href={licence.link}>
      {licence.title}
    </a>
  );

  const elDetail = (
    <div {...styles.detail}>
      <p>{detail}</p>
      <p>
        {elCC} {'(Open Commons)'}
      </p>
    </div>
  );

  return (
    <div {...css(styles.base, styles.normalize, props.style)}>
      <div {...styles.body.base}>
        <div {...styles.body.inner}>
          {elTitle}
          {elDetail}
        </div>
      </div>
    </div>
  );
};
