import React from 'react';
import { css, t } from '../common/index.mjs';

export type NotWithinTauriProps = { style?: t.CssValue };

export const NotWithinTauri: React.FC<NotWithinTauriProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      fontFamily: 'sans-serif',
      Absolute: 0,
      fontSize: 36,
      padding: 30,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>Warning: Not running with a Tauri environment</div>
    </div>
  );
};

export default NotWithinTauri;
