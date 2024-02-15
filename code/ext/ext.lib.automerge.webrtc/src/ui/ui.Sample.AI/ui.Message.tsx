import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type MessageProps = {
  message: t.Message;
  style?: t.CssValue;
};

export const Message: React.FC<MessageProps> = (props) => {
  const { message } = props;
  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      backgroundColor: Color.alpha(COLORS.CYAN, 0.1),
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      borderRadius: 6,
      padding: 10,
      paddingBottom: 15,
    }),
    role: css({
      fontWeight: 'bold',
      borderBottom: `solid 2px ${Color.alpha(COLORS.DARK, 0.3)}`,
      paddingBottom: 6,
      marginBottom: 10,
      fontSize: 14,
    }),
    content: css({ fontSize: 14, lineHeight: 1.3 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.role}>{`🤖 ${message.role}`}</div>
      <div {...styles.content}>{message.content}</div>
    </div>
  );
};
