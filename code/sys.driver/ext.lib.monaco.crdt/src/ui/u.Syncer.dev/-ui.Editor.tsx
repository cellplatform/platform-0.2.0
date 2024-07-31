import { useEffect, useState } from 'react';
import { Color, css, Monaco, rx, Syncer, type t } from './common';

export type SampleEditorProps = {
  enabled?: boolean;
  lens?: t.Lens | t.Doc;
  focusOnLoad?: boolean;
  debugLabel?: string;
  theme?: t.CommonTheme;
};

export const SampleEditor: React.FC<SampleEditorProps> = (props) => {
  const { lens, enabled = true, debugLabel } = props;
  const [ready, setReady] = useState<t.MonacoEditorReadyArgs>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const { dispose$, dispose } = rx.disposable(ready?.dispose$);
    if (ready && lens) {
      const { monaco, editor } = ready;
      Syncer.listen(monaco, editor, lens, { dispose$ });
    }
    return dispose;
  }, [!!ready, lens?.instance]);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      backgroundColor: theme.bg,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base)}>
      <Monaco.Editor
        theme={theme.name}
        enabled={enabled}
        language={'markdown'}
        focusOnLoad={props.focusOnLoad}
        onReady={(e) => {
          console.info(`⚡️ MonacoEditor.onReady (${debugLabel})`);
          setReady(e);
        }}
      />
    </div>
  );
};
