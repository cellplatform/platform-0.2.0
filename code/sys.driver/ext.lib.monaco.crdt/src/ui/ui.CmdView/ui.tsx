import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const View: React.FC<t.CmdViewProps> = (props) => {
  console.log(DEFAULTS.displayName, props); // TEMP 🐷

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      color: theme.fg,
      display: 'grid',
      placeItems: 'center',
    }),
  };

      // placeholder={displayUri}
      // onDispose={(e) => controllerRef.current?.dispose()}
        // const { monaco, editor } = e;
        // controllerRef.current = editorController({ monaco, editor, main });
            // visible: viewstate.current.docVisible,
            // onToggleClick: (e) => viewstate.change((d) => Dev.toggle(d, 'docVisible')),
  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ${DEFAULTS.name}`}</div>
    </div>
  );
};
