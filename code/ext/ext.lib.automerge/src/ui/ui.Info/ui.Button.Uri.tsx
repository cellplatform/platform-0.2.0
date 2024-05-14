import { useState } from 'react';
import { Button, DEFAULTS, Doc, Hash, Time, type t } from './common';

type D = t.InfoDataDocUri;

export type UriButtonProps = {
  uri?: t.UriString;
  shorten?: D['shorten'];
  prefix?: D['prefix'];
  clipboard?: D['clipboard'];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const UriButton: React.FC<UriButtonProps> = (props) => {
  const text = wrangle.text(props);

  const [copied, setCopied] = useState(false);
  const overlay = copied ? 'copied' : undefined;

  const copy = () => {
    navigator.clipboard.writeText(wrangle.clipboardText(props));
    setCopied(true);
    Time.delay(1500, () => setCopied(false));
  };

  return (
    <Button theme={props.theme} onClick={copy} overlay={overlay}>
      {text}
    </Button>
  );
};

/**
 * Helpers
 */
const wrangle = {
  text(props: UriButtonProps) {
    const { uri = '', prefix = DEFAULTS.doc.uri.prefix } = props;
    if (!uri) return '';

    const id = Doc.Uri.id(uri);
    const length = props.shorten ?? [4, 4];
    const shortened = Hash.shorten(id, length);

    if (!prefix) return shortened;
    return `${prefix.trim().replace(/\:+$/, '')}:${shortened}`;
  },

  clipboardText(props: UriButtonProps) {
    const { uri = '', clipboard = DEFAULTS.doc.uri.clipboard } = props;
    return clipboard(uri);
  },
} as const;
