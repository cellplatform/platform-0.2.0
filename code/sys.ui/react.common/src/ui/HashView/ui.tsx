import { useState } from 'react';

import { Color, DEFAULTS, css, type t } from './common';
import { Drop } from './ui.Drop';

export const View: React.FC<t.HashViewProps> = (props) => {
  const { bg = true } = props;
  const [dropped, setDropped] = useState<t.HashDropHandlerArgs>();

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: bg ? theme.bg : undefined,
      color: theme.fg,
      display: 'grid',
      gridTemplateRows: `auto 1fr`,
    }),
    titlbar: css({
      backgroundColor: Color.alpha(theme.fg, 0.02),
      borderBottom: `solid 1px ${Color.alpha(theme.fg, 0.15)}`,
      Padding: [10, 12],
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: `auto 1fr auto`,
      userSelect: 'none',
    }),
    body: css({ display: 'grid' }),
  };

  const elTitle = (
    <div {...styles.titlbar}>
      <div>{`${DEFAULTS.title}`}</div>
      <div />
      <div>{dropped?.size && <div>{dropped.size.display}</div>}</div>
    </div>
  );

  const elBody = (
    <div {...styles.body}>
      <Drop onDrop={(e) => setDropped(e)} theme={theme.name} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elTitle}
      {elBody}
    </div>
  );
};
