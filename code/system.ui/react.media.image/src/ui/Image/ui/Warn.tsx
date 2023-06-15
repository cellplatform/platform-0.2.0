import { type t } from '../common';

import { Util } from '../Util.mjs';
import { Overlay } from './Overlay';

export type WarnOverlayProps = {
  settings?: t.ImageWarningSettings;
  message?: string | JSX.Element;
  style?: t.CssValue;
};

export const WarnOverlay: React.FC<WarnOverlayProps> = (props) => {
  const blur = Util.warningBlur(props.settings);
  return <Overlay blur={blur} message={props.message} />;
};
