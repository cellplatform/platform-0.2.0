import { useState } from 'react';
import { Button, Color, css, DEFAULTS, Icons, type t } from './common';

type P = t.PeerUriButtonProps;

export const View: React.FC<P> = (props) => {
  const { fontSize = DEFAULTS.props.fontSize, monospace = DEFAULTS.props.monospace } = props;

  const text = wrangle.text(props);
  const [isOver, setOver] = useState(false);
  const [isDown, setDown] = useState(false);

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
      gridTemplateColumns: isOver ? `auto 1fr auto` : `auto 1fr`,
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
        <span {...styles.uri.prefix}>{text.prefix}</span>
        <span {...styles.uri.id}>{text.id}</span>
      </div>
    </div>
  );

  const elBody = (
    <div {...styles.body}>
      <Icons.Person color={Color.BLUE} size={fontSize * 1.5} />
      {elUri}
      {isOver && (
        <Icons.Copy color={Color.BLUE} size={wrangle.copyIconSize(props)} style={styles.copyIcon} />
      )}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Button
        children={elBody}
        theme={theme.name}
        onClick={(e) => {
          navigator.clipboard.writeText(text.uri);
        }}
        onMouse={(e) => {
          setOver(e.isOver);
          setDown(e.isDown);
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
    const {
      id = DEFAULTS.props.id,
      bold = DEFAULTS.props.bold,
      monospace = DEFAULTS.props.monospace,
      fontSize = DEFAULTS.props.fontSize,
    } = props;
    return { id, bold, monospace, fontSize } as const;
  },

  text(props: P) {
    const { id } = wrangle.props(props);
    const stripColons = (text: string) => text.replace(/:+$/g, '');
    const prefix = `${stripColons(props.prefix ?? DEFAULTS.props.prefix)}:`;
    return {
      prefix,
      id,
      uri: `${prefix}${id}`,
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
