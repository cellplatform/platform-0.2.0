import { useState } from 'react';
import { Button, Color, COLORS, css, DEFAULTS, Icons, Time, type t } from './common';

type P = t.PeerUriButtonProps;

export const View: React.FC<P> = (props) => {
  const { fontSize, monospace, clipboard, enabled } = wrangle.props(props);

  const text = wrangle.text(props);
  const [isDown, setDown] = useState(false);
  const [isOver, setOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const canCopy = isOver && enabled && clipboard;

  /**
   * Handlers
   */
  const copy = () => {
    navigator.clipboard.writeText(text.uri);
    setCopied(true);
    Time.delay(1500, () => {
      setCopied(false);
      setOver(false);
    });
  };

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const color = theme.fg;
  const styles = {
    base: css({ color, display: 'grid' }),
    body: css({
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: canCopy || copied ? `auto 1fr auto` : `auto 1fr`,
      columnGap: `${wrangle.rootColumnGap(props)}em`,
    }),
    uri: {
      base: css({
        position: 'relative',
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'start',
        fontSize,
        fontFamily: monospace ? 'monospace' : 'sans-serif',
        fontWeight: wrangle.fontWeight(props),
      }),
      inner: css({
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `auto auto`,
        columnGap: `${wrangle.uriColumnGap(props)}em`,
      }),
      prefix: css({ color: enabled ? Color.BLUE : color }),
      id: css({ color }),
      label: css({ opacity: copied ? 0.2 : 1, filter: `blur(${copied ? 5 : 0}px)` }),
      copied: css({
        Absolute: 0,
        display: 'grid',
        alignItems: 'center',
        color: Color.GREEN,
      }),
    },
    copyIcon: css({
      marginLeft: '0.6em',
    }),
  };

  const elUri = (
    <div {...styles.uri.base}>
      <div {...styles.uri.inner}>
        <span {...css(styles.uri.label, styles.uri.prefix)}>{`${text.prefix}:`}</span>
        <span {...css(styles.uri.label, styles.uri.id)}>{text.id}</span>
        {copied && <div {...styles.uri.copied}>{'copied'}</div>}
      </div>
    </div>
  );

  const CopyIcon = copied ? Icons.Done : Icons.Copy;
  const iconColor = !enabled ? color : copied ? Color.GREEN : Color.BLUE;
  const elCopyIcon = (
    <CopyIcon color={iconColor} size={wrangle.copyIconSize(props)} style={styles.copyIcon} />
  );
  const elBody = (
    <div {...styles.body}>
      <Icons.Person color={iconColor} size={fontSize * 1.5} />
      {elUri}
      {(canCopy || copied) && elCopyIcon}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Button
        enabled={enabled}
        active={!copied}
        children={elBody}
        theme={theme.name}
        onMouse={(e) => {
          setOver(e.isOver);
          setDown(e.isDown);
        }}
        onClick={(e) => {
          const { uri, prefix, id } = text;
          if (clipboard) copy();
          props.onClick?.({ uri, prefix, id });
        }}
      />
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  props(props: P) {
    const p = DEFAULTS.props;
    const {
      id = p.id,
      bold = p.bold,
      monospace = p.monospace,
      fontSize = p.fontSize,
      clipboard = p.clipboard,
      enabled = p.enabled,
    } = props;
    return { id, bold, monospace, fontSize, clipboard, enabled } as const;
  },

  text(props: P) {
    const { id } = wrangle.props(props);
    const stripColons = (text: string) => text.replace(/:+$/g, '');
    const prefix = stripColons(props.prefix ?? DEFAULTS.props.prefix);
    return {
      prefix,
      id,
      uri: `peer:${id}`,
    };
  },

  fontWeight(props: P) {
    const { bold, monospace } = wrangle.props(props);
    if (bold) {
      return monospace ? 600 : 800;
    } else {
      return 400;
    }
  },

  rootColumnGap(props: P) {
    const { fontSize } = wrangle.props(props);
    if (fontSize > 30) return 0.4;
    if (fontSize > 20) return 0.3;
    return 0.2;
  },

  uriColumnGap(props: P) {
    const { monospace, fontSize } = wrangle.props(props);
    if (monospace) return 0.1;
    return fontSize < 20 ? 0.25 : 0.1;
  },

  copyIconSize(props: P) {
    const { fontSize } = wrangle.props(props);
    return fontSize * (fontSize < 20 ? 1.3 : 1.1);
  },
} as const;
