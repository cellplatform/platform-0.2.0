import { useEffect, useRef, useState } from 'react';
import { DSL } from './-SPEC.dsl';
import { CmdBar, Keyboard, type t } from './common';

export type FooterProps = {
  cmd: { fc: t.Cmd<t.FarcasterCmd> };
  network: t.NetworkStore;
  style?: t.CssValue;
  onOverlay?: (e: { el?: JSX.Element }) => void;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { network, cmd } = props;
  const [lens, setLens] = useState<t.Lens>();
  const cmdbarRef = useRef(CmdBar.control());

  /**
   * Lifecycle
   */
  useEffect(() => {
    const doc = network.shared.doc;
    if (doc) setLens(network.shared.ns.lens('dev.cmdbar', {}));
  }, [network.shared.doc.instance]);

  /**
   * Keyboard
   */
  useEffect(() => {
    const cmdbar = cmdbarRef.current;
    const keys = Keyboard.until();
    keys.on('META + KeyK', (e) => {
      cmdbar.focus({});
      cmdbar.caretToEnd({});
    });
    return keys.dispose;
  }, []);

  /**
   * Render
   */
  return (
    <CmdBar
      control={cmdbarRef.current.cmd}
      doc={lens}
      style={props.style}
      onReady={(e) => console.info(`⚡️ cmdbar.onReady:`, e)}
      onText={async (e, ctx) => {
        if (!lens) return;
        const el = await DSL.matchView(e.text, lens);
        props.onOverlay?.({ el });
      }}
      onInvoke={async (e) => {
        /**
         * TODO 🐷
         * Extract a principled DSL.
         */
        const text = e.params.text;
        const parts = text.split(' ').map((part) => part.trim());
        const first = (parts[0] || '').trim();

        if (first === 'cast') {
          const text = parts[1];
          console.log('cast:', text);
          const send = cmd.fc.method('send:cast', 'send:cast:res');
          const res = await send({ text }).promise();
          console.log('cast:response:', res);
        }

        if (first === 'load') {
          const { Specs } = await import('../../test.ui/entry.Specs');
          const ns = parts.slice(1).join(' ').trim();
          const el = DSL.findAndRender(Specs, ns, { silent: false });
          props.onOverlay?.({ el });
        }
      }}
    />
  );
};
