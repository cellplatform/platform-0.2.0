import { isValidElement } from 'react';
import { CmdBar, Crdt, type t } from './common';
import { DSL } from './DSL';

export type FooterProps = {
  main: t.Shell;
  style?: t.CssValue;
  onOverlay?: (e: { el?: JSX.Element | null }) => void;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { main } = props;
  const state = main.state.cmdbar;

  /**
   * Render
   */
  return (
    <CmdBar.Stateful
      style={props.style}
      state={state}
      issuer={main.self.id}
      useKeyboard={true}
      theme={'Dark'}
      onReady={(e) => {
        const { dispose$ } = e;
        const cmdbar = e.cmdbar;
        main.cmdbar = cmdbar;

        const events = cmdbar.ctrl.events(e.dispose$);
        Crdt.Sync.Textbox.listen(e.textbox, state, e.paths.text, { dispose$ });

        events.on('Invoke', async (e) => {
          const el = await DSL.invoke(main, e.params.text, e.issuer);
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
