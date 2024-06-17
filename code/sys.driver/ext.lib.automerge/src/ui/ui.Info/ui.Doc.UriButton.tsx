import { DEFAULTS, Doc, Hash, MonospaceButton, type t } from './common';

type D = t.InfoDataDocUri;

export type UriButtonProps = {
  uri?: t.UriString;
  shorten?: D['shorten'];
  prefix?: D['prefix'];
  clipboard?: D['clipboard'];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const DocUriButton: React.FC<UriButtonProps> = (props) => {
  const text = wrangle.text(props);
  return (
    <MonospaceButton
      style={props.style}
      theme={props.theme}
      prefix={text.prefix}
      prefixMargin={2}
      text={text.short}
      onClipboard={(e) => e.write(wrangle.clipboardText(props))}
    />
  );
};

/**
 * Helpers
 */
const wrangle = {
  text(props: UriButtonProps) {
    const { uri = '', prefix = DEFAULTS.doc.uri.prefix } = props;
    const id = Doc.Uri.id(uri);
    return {
      id,
      short: Hash.shorten(id, props.shorten ?? [4, 4]),
      prefix: prefix ? `${prefix.trim().replace(/\:+$/, '')}:` : '',
    } as const;
  },

  clipboardText(props: UriButtonProps) {
    const { uri = '', clipboard = DEFAULTS.doc.uri.clipboard } = props;
    return clipboard(uri);
  },
} as const;
