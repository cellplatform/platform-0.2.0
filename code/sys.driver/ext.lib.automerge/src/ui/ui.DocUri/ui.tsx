import { useState } from 'react';
import { Copied } from '../ui.Buttons';
import { Color, css, DEFAULTS, Doc, Hash, MonospaceButton, Time, type t } from './common';

type UriPart = 'prefix' | 'id' | 'head';

export const View: React.FC<t.DocUriProps> = (props) => {
  const { clipboard = DEFAULTS.uri.clipboard } = props;
  const uri = wrangle.uri(props);

  const [overPart, setOverpart] = useState<UriPart | undefined>();
  const [forceDown, setForceDown] = useState(false);
  const [message, setMessage] = useState<JSX.Element | undefined>();

  if (!uri) return;
  const { fontSize } = props;
  const text = wrangle.text(props);

  /**
   * Handlers
   */
  const copyHandler = (part: UriPart) => {
    if (!clipboard) return;
    return () => {
      const text = wrangle.clipboardText(props, overPart);
      if (!text) return;

      navigator.clipboard.writeText(text);
      setMessage(<Copied theme={props.theme} fontSize={fontSize} style={styles.message} />);
      Time.delay(2000, () => setMessage(undefined));
    };
  };

  const mouseHandler = (part: UriPart): t.ButtonMouseHandler => {
    return (e) => {
      setOverpart(e.isOver ? part : undefined);
      setForceDown(e.isDown);
    };
  };

  /**
   * Render
   */
  const t = (prop: string, time: t.Msecs = 50) => `${prop} ${time}ms`;
  const transition = [t('opacity'), t('filter')].join(', ');
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      display: 'inline-block',
      userSelect: 'none',
      pointerEvents: clipboard ? 'auto' : 'none',
    }),
    body: css({
      Flex: 'x-center-center',
      opacity: message ? 0.2 : 1,
      filter: `blur(${message ? 5 : 0}px)`,
      transition,
    }),
    message: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elPrefix = (
    <MonospaceButton
      isDown={forceDown}
      theme={theme.name}
      fontSize={fontSize}
      prefix={{ text: text.prefix, opacity: 0.4 }}
      onMouse={mouseHandler('prefix')}
      onClick={copyHandler('prefix')}
    />
  );

  const elId = (
    <MonospaceButton
      isOver={wrangle.isOver(overPart, ['prefix', 'id'])}
      isDown={forceDown}
      theme={theme.name}
      fontSize={fontSize}
      text={text.short}
      onMouse={mouseHandler('id')}
      onClick={copyHandler('id')}
    />
  );

  const elHead = text.head && (
    <MonospaceButton
      isOver={wrangle.isOver(overPart, ['prefix', 'head'])}
      isDown={forceDown}
      theme={theme.name}
      fontSize={fontSize}
      suffix={{ text: text.head, margin: '0.1em', opacity: 0.4 }}
      onMouse={mouseHandler('head')}
      onClick={copyHandler('head')}
    />
  );

  const elBody = (
    <div {...styles.body}>
      {elPrefix}
      {elId}
      {elHead}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} onClick={props.onClick}>
      {elBody}
      {message}
    </div>
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
    const head = wrangle.head(props);
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

  head(props: t.DocUriProps) {
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

  clipboardText(props: t.DocUriProps, part?: UriPart) {
    const { clipboard = DEFAULTS.uri.clipboard } = props;
    if (!clipboard) return '';

    const docuri = wrangle.uri(props);
    const id = Doc.Uri.id(docuri);

    const heads = wrangle.heads(props);
    const hasHead = !!wrangle.head(props) && heads.length > 0;

    if (part === 'head') {
      if (!hasHead) return '';
      return `head:${heads.join(',')}`;
    }

    const uri = `crdt:${id}`;
    if (part === 'id') return uri;

    return hasHead ? `${uri}#${heads.join(',')}` : uri;
  },

  isOver(current: UriPart | undefined, parts: UriPart[]) {
    if (!current) return false;
    return parts.includes(current);
  },
} as const;
