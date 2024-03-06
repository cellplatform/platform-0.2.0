import { type t } from '../common';
import { Util } from '../u';
import { Overlay } from './Overlay';

export type WarningProps = {
  settings?: t.ImageWarningSettings;
  message?: string | JSX.Element;
  style?: t.CssValue;
};

export const Warning: React.FC<WarningProps> = (props) => {
  const blur = Util.warningBlur(props.settings);
  return <Overlay blur={blur} message={props.message} />;
};
