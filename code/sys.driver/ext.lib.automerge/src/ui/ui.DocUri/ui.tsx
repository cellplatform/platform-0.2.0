import { DEFAULTS, Doc, Hash, MonospaceButton, type t } from './common';

export const View: React.FC<t.DocUriProps> = (props) => {
  const uri = wrangle.uri(props);
  if (!uri) return;

  const text = wrangle.text(props);

  return (
    <MonospaceButton
      style={props.style}
      theme={props.theme}
      fontSize={props.fontSize}
      prefix={{ text: text.prefix, opacity: 0.4 }}
      text={text.short}
      suffix={{ text: text.head, margin: '0.2em', opacity: 0.4 }}
      onClipboard={(e) => e.write(wrangle.clipboardText(props))}
    />
  );
};

/**
 * Helpers
 */
const wrangle = {
  uri(props: t.DocUriProps): t.UriString {
    const { doc } = props;
    return (Doc.Is.doc(doc) ? doc.uri : doc) ?? '';
  },

  text(props: t.DocUriProps) {
    const uri = wrangle.uri(props);
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
    const heads = wrangle.heads(props);
    if (!props.head || heads.length === 0) return '';
    const length = props.head === true ? (DEFAULTS.uri.head as number) : props.head;
    const res = heads.map((h) => h.slice(0 - length)).join(',');
    return `#${res}`;
  },

  heads(props: t.DocUriProps): t.HashString[] {
    const { heads, doc } = props;
    if (Array.isArray(heads)) return heads;
    if (Doc.Is.doc(heads)) return Doc.heads(heads);
    if (Doc.Is.doc(doc)) return Doc.heads(doc);
    return [];
  },

  clipboardText(props: t.DocUriProps) {
    const { clipboard = DEFAULTS.uri.clipboard } = props;
    const uri = wrangle.uri(props);
    return clipboard(uri);
  },
} as const;
