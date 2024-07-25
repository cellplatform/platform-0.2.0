import { useState } from 'react';
import { Button, Color, css, DEFAULTS, Icons, type t } from './common';

type P = t.PeerUriButtonProps;

export const View: React.FC<P> = (props) => {
  const { fontSize, monospace, clipboard } = wrangle.props(props);

  const text = wrangle.text(props);
  const [isDown, setDown] = useState(false);
  const [isOver, setOver] = useState(false);
  const canCopy = isOver && clipboard;

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
      gridTemplateColumns: canCopy ? `auto 1fr auto` : `auto 1fr`,
      columnGap: `${wrangle.rootColumnGap(props)}em`,
    }),
    uri: {
      base: css({
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'start',
        fontSize,
        fontFamily: monospace ? 'monospace' : 'sans-serif',
        fontWeight: wrangle.fontWeight(props),
      }),
      inner: css({
        display: 'grid',
        gridTemplateColumns: `auto auto`,
        columnGap: `${wrangle.uriColumnGap(props)}em`,
      }),
      prefix: css({ color: Color.BLUE }),
      id: css({ color: theme.fg }),
    },
    copyIcon: css({
      marginLeft: '0.6em',
    }),
  };

  const elUri = (
    <div {...styles.uri.base}>
      <div {...styles.uri.inner}>
        <span {...styles.uri.prefix}>{`${text.prefix}:`}</span>
        <span {...styles.uri.id}>{text.id}</span>
      </div>
    </div>
  );

  const elBody = (
    <div {...styles.body}>
      <Icons.Person color={Color.BLUE} size={fontSize * 1.5} />
      {elUri}
      {canCopy && (
        <Icons.Copy color={Color.BLUE} size={wrangle.copyIconSize(props)} style={styles.copyIcon} />
      )}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Button
        children={elBody}
        theme={theme.name}
        onMouse={(e) => {
          setOver(e.isOver);
          setDown(e.isDown);
        }}
        onClick={(e) => {
          const { uri, prefix, id } = text;
          if (clipboard) navigator.clipboard.writeText(uri);
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
    } = props;
    return { id, bold, monospace, fontSize, clipboard } as const;
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
