import { isValidElement, useEffect } from 'react';
import { CmdBar, Doc, Keyboard, rx, type t } from './common';
import { DSL } from './DSL';

export type FooterProps = {
  main: t.Main;
  style?: t.CssValue;
  onOverlay?: (e: { el?: JSX.Element }) => void;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { main } = props;

  /**
   * Keyboard
   */
  useEffect(() => {
    const life = rx.disposable();
    const keys = Keyboard.until(life.dispose$);
    const cmdbar = CmdBar.Ctrl.methods(main.cmd.cmdbar);

    keys.on('Tab', (e) => e.handled());
    keys.on('META + KeyK', () => {
      cmdbar.focus({});
      cmdbar.caretToEnd({});
    });
    keys.dbl().on('META + KeyK', () => {
      const path = CmdBar.Path.default.text;
      main.lens.cmdbar.change((d) => Doc.Text.replace(d, path, ''));
    });

    return life.dispose;
  }, []);

  /**
   * Render
   */
  return (
    <CmdBar
      ctrl={main.cmd.cmdbar}
      doc={main.lens.cmdbar}
      style={props.style}
      onReady={(e) => console.info(`⚡️ cmdbar.onReady:`, e)}
      onText={async (e, ctx) => {
        const el = await DSL.matchView(e.text, main);
        props.onOverlay?.({ el });
      }}
      onInvoke={async (e) => {
        const argv = e.params.text;
        const res = await DSL.invoke(argv, main);
        if (isValidElement(res)) props.onOverlay?.({ el: res });
      }}
    />
  );
};
