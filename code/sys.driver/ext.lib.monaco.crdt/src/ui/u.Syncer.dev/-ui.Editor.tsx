import { useEffect, useState } from 'react';
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
    identity: {
      base: css({
        Absolute: [-22, 6, null, null],
        fontFamily: 'monospace',
        fontSize: 10,
        color: Color.alpha(theme.fg, 0.3),
      }),
      value: css({ color: Color.alpha(theme.fg, 1) }),
    },
  };

  const elIdentity = props.identity && (
    <div {...styles.identity.base}>
      <span>{`identity: “`}</span>
      <span {...styles.identity.value}>{props.identity}</span>
      <span>{`”`}</span>
    </div>
  );

  return (
    <div {...css(styles.base)}>
      {elIdentity}
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
