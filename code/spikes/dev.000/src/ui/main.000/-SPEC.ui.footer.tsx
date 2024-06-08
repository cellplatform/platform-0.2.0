import { useEffect, useState } from 'react';
import { CmdBar, type t } from './common';

export type FooterProps = {
  network: t.NetworkStore;
  style?: t.CssValue;
  onLoad?: (e: { name: string }) => void;
  onUnload?: (e: {}) => void;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { network } = props;
  const [lens, setLens] = useState<t.Lens>();

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
      onInvoke={(e, cmd) => {
        /**
         * TODO 🐷
         * Extract a principled DSL.
         */

        console.log('onInvoke', e, cmd);
        const text = e.params.text;
        const parts = text.split(' ').map((part) => part.trim());
        if (parts[0] === 'load' && parts[1]) props.onLoad?.({ name: parts[1] });
        if (parts[0] === 'unload') props.onUnload?.({});
      }}
    />
  );
};
