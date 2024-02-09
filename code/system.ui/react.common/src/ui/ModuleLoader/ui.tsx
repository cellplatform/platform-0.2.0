import { useEffect, useRef, useState } from 'react';
import { Flip, Color, COLORS, css, DEFAULTS, FC, rx, type t, CommandBar } from './common';

export const View: React.FC<t.ModuleLoaderProps> = (props) => {
  const { flipped = false } = props;
  const command: t.ModuleLoaderCommandProps = { ...DEFAULTS.command, ...props.command };

  console.log('command', command);

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
    body: css({
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    main: css({ display: 'grid', placeItems: 'center' }),
    commandbar: css({
      display: command.visible ? 'block' : 'none',
    }),
  };

  const elBody = (
    <div {...styles.body}>
      <div {...styles.main}>{`🐷 ${DEFAULTS.displayName}`}</div>
      <CommandBar style={styles.commandbar} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Flip flipped={flipped} front={elBody} />
    </div>
  );
};
