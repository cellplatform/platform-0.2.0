import { useEffect, useState } from 'react';
import { Ctrl } from '../CmdBar.Ctrl';
import { Args, Color, css, type t } from './common';

export const Run: React.FC<t.MainRunProps> = (props) => {
  const [rendered, setRendered] = useState<t.RenderOutput>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const ctrl = wrangle.ctrl(props);
    const events = ctrl?.events();

    /**
     * Delegate to invoke handle.
     */
    events?.on('Invoke', (e) => {
      const argv = e.params.text.trim();
      const args = Args.parse(argv);
      let _el: t.RenderOutput;
      props.onInvoke?.({
        theme: theme.name,
        argv,
        args,
        render: (el) => (_el = el),
      });
      setRendered(Boolean(_el) ? _el : undefined);
    });
    return events?.dispose;
  }, [props.ctrl]);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      display: 'grid',
    }),
    empty: css({
      padding: 15,
      userSelect: 'none',
    }),
  };

  ('⚡️💦🐷🌳🦄 🍌🧨🌼✨🧫 🐚👋🧠⚠️ 💥👁️ ↑↓←→');

  const elEmpty = !rendered && <div {...styles.empty}>{`Module.Run → ƒ(n)`}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {rendered}
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  ctrl(props: t.MainRunProps) {
    return props.ctrl ? Ctrl.toCtrl(props.ctrl) : undefined;
  },
} as const;
