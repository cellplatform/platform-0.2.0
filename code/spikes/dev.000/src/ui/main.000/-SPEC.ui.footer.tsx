import { useEffect, useState } from 'react';
import { CmdBar, type t } from './common';

export type FooterProps = {
  cmd: t.Cmd<t.FarcasterCmd>;
  network: t.NetworkStore;
  style?: t.CssValue;
  onLoad?: (e: { name: string }) => void;
  onUnload?: (e: {}) => void;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { network, cmd } = props;
  const [lens, setLens] = useState<t.Lens>();

  const sendCast = cmd.method('send:cast', 'send:cast:res');

  /**
   * Lifecycle
   */
  useEffect(() => {
    const doc = network.shared.doc;
    if (doc) setLens(network.shared.ns.lens('dev.cmdbar', {}));
  }, [network.shared.doc.instance]);

  /**
   * Render
   */
  return (
    <CmdBar
      doc={lens}
      style={props.style}
      onReady={(e) => {
        console.info(`⚡️ cmdbar.onReady:`, e);
      }}
      onInvoke={async (e, cmd) => {
        /**
         * TODO 🐷
         * Extract a principled DSL.
         */

        console.log('onInvoke', e, cmd);

        const text = e.params.text;
        const parts = text.split(' ').map((part) => part.trim());
        const first = (parts[0] || '').trim();

        if (first === 'load' && parts[1]) props.onLoad?.({ name: parts[1] });
        if (first === 'unload') props.onUnload?.({});
        if (first === 'cast') {
          const text = parts[1];
          console.log('cast:', text);
          const res = await sendCast.invoke({ text }).promise();
          console.log('cast:response:', res);
        }
      }}
    />
  );
};
