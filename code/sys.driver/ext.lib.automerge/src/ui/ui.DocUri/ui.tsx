import { useState } from 'react';
import { Copied } from '../ui.Buttons';
import { Color, css, DEFAULTS, Doc, Hash, MonospaceButton, Time, type t } from './common';

export const View: React.FC<t.DocUriProps> = (props) => {
  const { clipboard = DEFAULTS.uri.clipboard } = props;
  const uri = wrangle.uri(props);

  type S = { is: { over: boolean; down: boolean } };
  const [mouse, setMouse] = useState<S>({ is: { over: false, down: false } });
  const [overPart, setOverpart] = useState<t.DocUriPart | undefined>();
  const [forceDown, setForceDown] = useState(false);
  const [isCopied, setCopied] = useState(false);

  if (!uri) return;
  const { fontSize } = props;
  const text = wrangle.text(props);

  /**
   * Handlers
   */
  const copyHandler = (part: t.DocUriPart) => {
    if (!clipboard) return;
    return () => {
      const text = wrangle.clipboardText(props, part);
      if (!text) return;

      navigator.clipboard.writeText(text);
      setCopied(true);
      Time.delay(1500, () => setCopied(false));

      const is = mouse.is;
      props.onCopy?.({ is, uri, part });
    };
  };

  const mouseHandler = (part: t.DocUriPart): t.ButtonMouseHandler => {
    return (e) => {
      const is = { over: e.isOver, down: e.isDown };
      setMouse({ is });
      setOverpart(is.over ? part : undefined);
      setForceDown(is.down);
      props.onMouse?.({ uri, part, is });
    };
  };

  const handleClick: React.MouseEventHandler = (e) => {
    props.onClick?.(e);
  };

  /**
   * Render
   */
  const t = (prop: string, time: t.Msecs = 50) => `${prop} ${time}ms`;
  const transition = [t('opacity'), t('filter')].join(', ');
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      display: 'inline-block',
      userSelect: 'none',
      pointerEvents: clipboard ? 'auto' : 'none',
    }),
    body: css({
      Flex: 'x-center-center',
      opacity: isCopied ? 0.2 : 1,
      filter: `blur(${isCopied ? 5 : 0}px)`,
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
      onMouse={mouseHandler('Prefix')}
      onClick={copyHandler('Prefix')}
      style={{ pointerEvents: 'none' }}
    />
  );

  const elId = (
    <MonospaceButton
      isOver={wrangle.isOver(overPart, ['Prefix', 'Id'])}
      isDown={forceDown}
      theme={theme.name}
      fontSize={fontSize}
      text={text.short}
      onMouse={mouseHandler('Id')}
      onClick={copyHandler('Id')}
    />
  );

  const elHead = text.head && (
    <MonospaceButton
      isOver={wrangle.isOver(overPart, ['Prefix', 'Head'])}
      isDown={forceDown}
      theme={theme.name}
      fontSize={fontSize}
      suffix={{ text: text.head, margin: '0.1em', opacity: 0.4 }}
      onMouse={mouseHandler('Head')}
      onClick={copyHandler('Head')}
    />
  );

  const elBody = (
    <div {...styles.body}>
      {elPrefix}
      {elId}
      {elHead}
    </div>
  );

  const elCopied = isCopied && (
    <Copied
      text={props.copiedText || 'copied'}
      fontSize={fontSize}
      theme={props.theme}
      style={styles.message}
    />
  );

  return (
    <div {...css(styles.base, props.style)} onClick={handleClick}>
      {elBody}
      {elCopied}
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

  clipboardText(props: t.DocUriProps, part?: t.DocUriPart) {
    const { clipboard = DEFAULTS.uri.clipboard } = props;
    if (!clipboard) return '';

    const docuri = wrangle.uri(props);
    const id = Doc.Uri.id(docuri);
    const uri = `crdt:a.${id}`;

    const heads = wrangle.heads(props);
    const hasHead = !!wrangle.head(props) && heads.length > 0;

    if (part === 'Id') return uri;
    return hasHead ? `${uri}@head=${heads.join(',')}` : uri;
  },

  isOver(current: t.DocUriPart | undefined, parts: t.DocUriPart[]) {
    if (!current) return false;
    return parts.includes(current);
  },
} as const;
