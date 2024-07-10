import { isValidElement } from 'react';
import { CmdBar, Crdt, type t } from './common';
import { DSL } from './DSL';

export type FooterProps = {
  main: t.Shell;
  style?: t.CssValue;
  onOverlay?: (e: { el?: JSX.Element }) => void;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { main } = props;
  const state = main.state.cmdbar;

  /**
   * Render
   */
  return (
    <CmdBar.Stateful
      state={state}
      useKeyboard={true}
      theme={'Dark'}
      onReady={(e) => {
        const { dispose$ } = e;
        const cmdbar = e.cmdbar;
        main.cmd.cmdbar = cmdbar;
        const events = cmdbar.ctrl.events(e.dispose$);
        Crdt.Sync.Textbox.listen(e.textbox, state, e.paths.text, { dispose$ });

        events.on('Invoke', async (e) => {
          const el = await DSL.invoke(e.params.text, main);
          if (isValidElement(el)) props.onOverlay?.({ el });
        });
      }}
      onChange={async (e) => {
        const el = await DSL.matchView(e.to, main);
        props.onOverlay?.({ el });
      }}
    />
  );
};
