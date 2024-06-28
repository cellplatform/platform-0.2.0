import { MonospaceButton } from '../ui.Buttons';
import { DEFAULTS, Hash, type t } from './common';

export type MonoHashProps = {
  hash?: string;
  length?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const MonoHash: React.FC<MonoHashProps> = (props) => {
  const { hash = '', theme, length = DEFAULTS.hash.length } = props;
  return (
    <MonospaceButton
      style={props.style}
      prefix={{ text: '#', margin: 3 }}
      text={Hash.shorten(hash, [0, length])}
      theme={theme}
      onClipboard={(e) => e.write(hash)}
    />
  );
};
