import { useState } from 'react';
import { WebRtc } from '../../WebRtc';
import { Wrangle } from './Wrangle.mjs';
import { Button, COLORS, DEFAULTS, FC, Icons, TextSyntax, copyPeer, css, type t } from './common';

const View: React.FC<t.PeerIdProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    fontSize = DEFAULTS.fontSize,
    copyable = DEFAULTS.copyable,
  } = props;
  const message = (props.message ?? '').trim();

  const [isOver, setOver] = useState(false);

  /**
   * Handlers
   */
  const handleClick = () => {
    if (!props.peer) return;
    const id = WebRtc.Util.asId(props.peer);
    const uri = WebRtc.Util.asUri(id);
    const copy = () => copyPeer(id);
    props.onClick?.({ id, uri, copy });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      fontSize,
      opacity: props.peer ? 1 : 0.3,
      filter: `grayscale(${Wrangle.greyscale(props)})`,
      transition: 'all 150ms ease',
    }),
    body: css({ position: 'relative', Flex: 'x-center-start' }),
    icon: css({ marginLeft: fontSize / 5 }),
    text: css({
      opacity: message ? 0.3 : 1,
      filter: message ? 'blur(5px)' : undefined,
    }),
    message: css({
      Absolute: 0,
      fontSize,
      color: COLORS.DARK,
      userSelect: 'none',
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elText = (
    <TextSyntax
      text={Wrangle.peerText(props)}
      monospace={true}
      fontWeight={'bold'}
      fontSize={fontSize}
      style={styles.text}
    />
  );

  const elMessage = message && <div {...styles.message}>{message}</div>;

  if (props.onClick) {
    const elCopy = isOver && enabled && copyable && !message && (
      <Icons.Copy size={fontSize + 2} style={styles.icon} color={COLORS.CYAN} tooltip={'Copy'} />
    );

    const elBody = (
      <div {...styles.body}>
        {elText}
        {elCopy}
        {elMessage}
      </div>
    );

    return (
      <Button
        onClick={handleClick}
        isEnabled={enabled}
        onMouse={(e) => setOver(e.isOver)}
        style={css(styles.base, props.style)}
      >
        {elBody}
      </Button>
    );
  }

  // NB: Not a "pressable" button - return just the simple colored-highlighted text.
  return elText;
};

/**
 * Helpers
 */
// const Wrangle = {
//   greyscale() {
//     //
//   },
// };

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const PeerId = FC.decorate<t.PeerIdProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'PeerId' },
);
