import { useEffect, useState, useRef, useCallback } from 'react';

import { Color, Monaco, css, type t } from './common';
import { editorController } from './Me.editor';

export type MeProps = {
  main: t.Shell;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Me: React.FC<MeProps> = (props) => {
  const { main } = props;
  const controllerRef = useRef<t.ShellEditorController>();

  /**
   * Render
   */
  const theme = Color.theme(props.theme ?? 'Dark');
  const styles = {
    base: css({
      backgroundColor: theme.bg,
      color: theme.fg,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Monaco.Editor
        theme={theme.name}
        language={'yaml'}
        onDispose={(e) => controllerRef.current?.dispose()}
        onReady={(e) => {
          const { monaco, editor } = e;
          controllerRef.current = editorController({ monaco, editor, main });
        }}
      />
    </div>
  );
};
