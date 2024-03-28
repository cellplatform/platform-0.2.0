import { type t } from './common';

export type GroupVideoProps = {
  client?: t.WebRtcEvents;
  selected?: t.PeerId;
  message?: string | JSX.Element;
  style?: t.CssValue;
};
