import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC, Time } from '../common.mjs';
import { Fetch } from '../Fetch.mjs';

const DEFAULT = {
  V0: '0.0.0',
};

const DETAIL = `
This report is in the final stages of edits and review for its 1.0 release.
After the initial 1.0 release it will remain on a regular update cycle reflecting
the emerging changes within this nascent yet fast evolving space.
`;

const LICENCE = {
  title: 'CC BY 4.0',
  link: 'https://creativecommons.org/licenses/by/4.0/',
};

export type RootHoldingProps = {
  style?: t.CssValue;
};

export const RootHolding: React.FC<RootHoldingProps> = (props) => {
  const [version, setVersion] = useState(DEFAULT.V0);
  const [versionVisible, setVersionVisible] = useState(false);

  /**
   * Lifecycle
   */
  useEffect(() => {
    (async () => {
      /**
       * 💦 FETCH Version (Data)
       */
      const log = await Fetch.log();
      const version = log?.latest.version || DEFAULT.V0;
      setVersion(version);

      Time.delay(800, () => setVersionVisible(true));
    })();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    normalize: css({ fontFamily: 'sans-serif', color: COLORS.DARK }),
    base: css({
      Absolute: 0,
      Flex: 'y-center-center',
      userSelect: 'none',
    }),
    body: {
      base: css({
        Flex: 'x-center-center',
        marginBottom: '2%',
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
        paddingBottom: 15,
        '@media (max-width: 660px)': { Flex: 'y-stretch-stretch' },
      }),
      path: css({ fontSize: 32, fontWeight: 'bold' }),
      version: css({
        fontSize: 32,
        opacity: versionVisible ? 1 : 0,
        transition: 'opacity 3000ms',
      }),
    },
    detailTitle: css({
      marginTop: 55,
      marginBottom: 20,
      fontWeight: '900',
      opacity: 0.3,
    }),
    detail: css({
      lineHeight: 1.7,
      fontSize: 16,
      '@media (max-height: 550px)': { display: 'none' },
    }),
    a: css({ color: COLORS.CYAN }),
    p: css({ marginTop: 0 }),
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
      <div {...styles.title.version}>{version}</div>
    </div>
  );

  const elCC = (
    <a {...styles.a} href={LICENCE.link}>
      {LICENCE.title}
    </a>
  );

  const elDetail = (
    <div {...styles.detail}>
      <div {...styles.detailTitle}>{'STATUS'}</div>
      <p {...styles.p}>{DETAIL}</p>
      <p {...styles.p}>
        Content {elCC} {'(Open Commons)'}
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
