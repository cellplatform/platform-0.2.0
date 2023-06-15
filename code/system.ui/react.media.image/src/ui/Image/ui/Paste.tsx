import { type t } from '../common';

import { Util } from '../Util.mjs';
import { Overlay } from './Overlay';

export type PasteOverlayProps = {
  settings?: t.ImagePasteSettings;
  style?: t.CssValue;
};

export const PasteOverlay: React.FC<PasteOverlayProps> = (props) => {
  const blur = Util.focusedBlur(props.settings);
  const message = Util.focusedContent(props.settings);
  return <Overlay blur={blur} message={message} />;
};
