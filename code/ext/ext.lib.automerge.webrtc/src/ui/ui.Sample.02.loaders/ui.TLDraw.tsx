import '@tldraw/tldraw/tldraw.css';

import { Dev, type t } from '../../test.ui';
import { Specs } from 'ext.lib.tldraw';

export type TLDrawProps = {
  store: t.Store;
  docuri: string;
  peerid?: string;
  style?: t.CssValue;
};

export const TLDraw: React.FC<TLDrawProps> = (props) => {
  const { store, docuri, peerid } = props;
  const spec = Specs['ext.lib.tldraw.ui.Canvas.Crdt'];
  return <Dev.Harness spec={spec} env={{ store, docuri, peerid }} />;
};
