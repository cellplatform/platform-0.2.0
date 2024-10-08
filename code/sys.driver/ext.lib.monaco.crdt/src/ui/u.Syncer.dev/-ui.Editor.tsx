import { useEffect, useState } from 'react';
import { IdentityLabel } from '../ui.CrdtEditor';
import { Color, css, Monaco, rx, Syncer, type t } from './common';

type LensInput = t.Lens | t.Doc;

export type SampleEditorProps = {
  identity?: t.IdString;
  lens?: LensInput;
  focusOnLoad?: boolean;
  debugLabel?: string;
  enabled?: boolean;
  theme?: t.CommonTheme;
  onReady?: SampleEditorReadyHandler;
};

export type SampleEditorReadyHandler = (e: SampleEditorReadyHandlerArgs) => void;
export type SampleEditorReadyHandlerArgs = Pick<t.MonacoEditorReadyArgs, 'editor' | 'monaco'> & {
  readonly identity: t.IdString;
  readonly syncer: t.SyncListener;
};

/**
 * Component
 */
export const SampleEditor: React.FC<SampleEditorProps> = (props) => {
  const { lens, enabled = true, identity = 'UNKNOWN', debugLabel } = props;
  const [ready, setReady] = useState<t.MonacoEditorReadyArgs>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const { dispose$, dispose } = rx.disposable(ready?.dispose$);
    if (ready && lens) {
      const { monaco, editor } = ready;
      const syncer = Syncer.listen(monaco, editor, lens, { identity, dispose$ });
      props.onReady?.({ identity, monaco, editor, syncer });
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
    identity: css({ Absolute: [-22, 6, null, null] }),
  };

  return (
    <div {...css(styles.base)}>
      <IdentityLabel identity={props.identity} theme={theme.name} style={styles.identity} />
      <Monaco.Editor
        theme={theme.name}
        enabled={enabled}
        language={'markdown'}
        focusOnLoad={props.focusOnLoad}
        onReady={(e) => setReady(e)}
      />
    </div>
  );
};
