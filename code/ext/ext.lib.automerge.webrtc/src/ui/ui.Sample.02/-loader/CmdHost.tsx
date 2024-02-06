import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Pkg } from '../common';

import { CmdHost as Base } from 'sys.ui.react.common';

export type CmdHostProps = {
  store: t.Store;
  shared: t.Lens<t.SampleSharedMain>;
  style?: t.CssValue;
};

export const CmdHost: React.FC<CmdHostProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({ backgroundColor: COLORS.WHITE, display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Base.Stateful pkg={Pkg} badge={badge} />
    </div>
  );
};

const badge = {
  image: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/ci.node.yml/badge.svg',
  href: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/ci.node.yml',
} as const;
