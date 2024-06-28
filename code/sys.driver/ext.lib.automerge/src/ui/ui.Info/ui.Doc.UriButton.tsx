import { DEFAULTS, Doc, MonospaceButton, type t } from './common';

type D = t.InfoDataDocUri;

export type UriButtonProps = {
  doc?: t.Doc;
  shorten?: D['shorten'];
  prefix?: D['prefix'];
  head?: D['head'];
  clipboard?: D['clipboard'];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const DocUriButton: React.FC<UriButtonProps> = (props) => {
  const { doc } = props;

  if (!doc) return;
  const text = wrangle.text(props);

  return (
    <MonospaceButton
      style={props.style}
      theme={props.theme}
      prefix={text.prefix}
      prefixMargin={2}
      text={text.short}
      suffix={text.head}
      suffixMargin={2}
      onClipboard={(e) => e.write(wrangle.clipboardText(props))}
    />
  );
};

/**
 * Helpers
 */
const wrangle = {
  text(props: UriButtonProps) {
    const uri = props.doc?.uri ?? '';
    const id = Doc.Uri.id(uri);
    const shorten = wrangle.shorten(props);
    const head = wrangle.head(props, id);
    const prefix = `${wrangle.prefix(props)}${id.slice(0, shorten[0])}..`;
    return {
      id,
      prefix,
      short: id.slice(0 - shorten[1]),
      head,
    } as const;
  },

  prefix(props: UriButtonProps) {
    const { prefix = DEFAULTS.doc.uri.prefix } = props;
    return prefix ? `${prefix.trim().replace(/\:+$/, '')}:` : '';
  },

  shorten(props: UriButtonProps): [number, number] {
    const { shorten = DEFAULTS.doc.uri.shorten } = props;
    return Array.isArray(shorten) ? shorten : [shorten, shorten];
  },

  head(props: UriButtonProps, id: string) {
    if (!props.head || !props.doc) return '';
    const length = props.head === true ? (DEFAULTS.doc.uri.head as number) : props.head;
    const heads = Doc.heads(props.doc)
      .map((h) => h.slice(0 - length))
      .join(',');
    return `:${heads}`;
  },

  clipboardText(props: UriButtonProps) {
    const { clipboard = DEFAULTS.doc.uri.clipboard } = props;
    const uri = props.doc?.uri ?? '';
    return clipboard(uri);
  },
} as const;
