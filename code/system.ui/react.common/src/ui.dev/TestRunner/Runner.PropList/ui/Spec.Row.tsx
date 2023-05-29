import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC, Switch, Icons, Button } from '../common';
import { useSpecImports } from '../hooks/useSpecImports.mjs';

export type SpecRowProps = {
  spec: t.SpecImport;
  selected?: boolean;
  style?: t.CssValue;
};

export const SpecRow: React.FC<SpecRowProps> = (props) => {
  const spec = useSpecImports(props.spec);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
    left: css({
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 8,
    }),
    right: css({
      paddingTop: 1,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'top',
    }),
    runIcon: css({
      paddingTop: 1,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'top',
    }),
    desc: css({
      paddingRight: 5,
      color: COLORS.DARK,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Button>
        <div {...styles.left}>
          <Icons.Play size={12} style={styles.runIcon} />
          <div {...styles.desc}>{spec.description}</div>
        </div>
      </Button>
      <div {...styles.right}>
        <Switch height={12} value={props.selected} />
      </div>
    </div>
  );
};
