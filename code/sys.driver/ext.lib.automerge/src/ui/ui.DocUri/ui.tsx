import { DEFAULTS, Doc, Hash, MonospaceButton, type t } from './common';

export const View: React.FC<t.DocUriProps> = (props) => {
  const { uri } = props;

  if (!uri) return;
  const text = wrangle.text(props);

  return (
    <MonospaceButton
      style={props.style}
      theme={props.theme}
      prefix={{ text: text.prefix, margin: 2, opacity: 0.4 }}
      text={text.short}
      suffix={{ text: text.head, margin: 2, opacity: 0.4 }}
      onClipboard={(e) => e.write(wrangle.clipboardText(props))}
    />
  );
};

/**
 * Helpers
 */
const wrangle = {
  text(props: t.DocUriProps) {
    const uri = props.uri ?? '';
    const id = Doc.Uri.id(uri);
    const shorten = wrangle.shorten(props);
    const head = wrangle.head(props, id);
    const prefix = wrangle.prefix(props);
    const short = Hash.shorten(id, shorten);
    return { id, prefix, short, head } as const;
  },

  prefix(props: t.DocUriProps) {
    const { prefix = DEFAULTS.uri.prefix } = props;
    return prefix ? `${prefix.trim().replace(/\:+$/, '')}:` : '';
  },

  shorten(props: t.DocUriProps): [number, number] {
    const { shorten = DEFAULTS.uri.shorten } = props;
    return Array.isArray(shorten) ? shorten : [shorten, shorten];
  },

  head(props: t.DocUriProps, id: string) {
    if (!props.head || !props.heads) return '';
    const length = props.head === true ? (DEFAULTS.uri.head as number) : props.head;
    const heads = props.heads.map((h) => h.slice(0 - length)).join(',');
    return `#${heads}`;
  },

  clipboardText(props: t.DocUriProps) {
    const { clipboard = DEFAULTS.uri.clipboard } = props;
    const uri = props.uri ?? '';
    return clipboard(uri);
  },
} as const;
