import { useEffect, useState } from 'react';
import { Color, css, Monaco, rx, Syncer, type t } from './common';

type LensInput = t.Lens | t.Doc;

export type SampleEditorProps = {
  identity?: string;
  lens?: LensInput;
  focusOnLoad?: boolean;
  debugLabel?: string;
  enabled?: boolean;
  theme?: t.CommonTheme;
};

export const SampleEditor: React.FC<SampleEditorProps> = (props) => {
  const { lens, enabled = true, debugLabel, identity = 'UNKNOWN' } = props;
  const [ready, setReady] = useState<t.MonacoEditorReadyArgs>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const { dispose$, dispose } = rx.disposable(ready?.dispose$);
    if (ready && lens) {
      const { monaco, editor } = ready;
      const syncer = Syncer.listen(monaco, editor, lens, { identity, dispose$ });

    }
    return dispose;
  }, [!!ready, lens?.instance]);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      backgroundColor: theme.bg,
      display: 'grid',
    }),
    identity: css({
      Absolute: [-22, 6, null, null],
      fontFamily: 'monospace',
      fontSize: 10,
      opacity: 0.3,
    }),
  };

  const elIdentity = props.identity && (
    <div {...styles.identity}>{`identity: "${props.identity}"`}</div>
  );

  return (
    <div {...css(styles.base)}>
      {elIdentity}
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
