import { useEffect, useRef, useState } from 'react';
import { Flip, Color, COLORS, css, DEFAULTS, FC, rx, type t, CommandBar } from './common';
import { Wrangle } from './u.Wrangle';

export const View: React.FC<t.ModuleNamespaceProps> = (props) => {
  const { flipped = false } = props;
  const command: t.ModuleNamespaceCommandbarProps = { ...DEFAULTS.command, ...props.commandbar };
  const is = Wrangle.is(props);

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      color: is.dark ? COLORS.WHITE : COLORS.BLACK,
    }),
    body: css({
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    main: css({ display: 'grid', placeItems: 'center' }),
    bar: css({ display: command.visible ? 'block' : 'none' }),
  };

  const elBody = (
    <div {...styles.body}>
      <div {...styles.main}>{`🐷 ${DEFAULTS.displayName}`}</div>
      <CommandBar style={styles.bar} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Flip flipped={flipped} front={elBody} />
    </div>
  );
};
