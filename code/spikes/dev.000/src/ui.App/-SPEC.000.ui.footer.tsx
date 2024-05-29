import { useEffect, useState } from 'react';
import { CmdBar, type t } from './common';

export type FooterProps = {
  network: t.NetworkStore;
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { network } = props;
  const [lens, setLens] = useState<t.Lens>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const doc = network.shared.doc;
    if (doc) setLens(network.shared.ns.lens('harness.cmdbar', {}));
  }, [network.shared.doc.instance]);

  /**
   * Render
   */
  return <CmdBar doc={lens} style={props.style} />;
};
