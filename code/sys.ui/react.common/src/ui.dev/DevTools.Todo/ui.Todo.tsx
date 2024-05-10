import { useEffect, useState } from 'react';

import { Color, COLORS, css, DEFAULTS, FC, Style, t, TextProcessor } from '../common';
import { DEFAULT } from './ui.Todo.DEFAULT.mjs';
import { useGlobalStyles } from '../DevTools.GlobalStyles';

export type TodoProps = {
  text?: string;
  style?: t.DevTodoStyle;
};

const View: React.FC<TodoProps> = (props) => {
  const style = { ...DEFAULT.style, ...props.style };
  const text = Wrangle.text(props);
  const isEmpty = Wrangle.isEmpty(props);
  const isSingleline = isEmpty || !text.includes('\n');

  useGlobalStyles();
  const [safeHtml, setSafeHtml] = useState('');

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (text) {
      TextProcessor.toHtml(text).then((e) => setSafeHtml(e.html));
    }
  }, [text]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      ...Style.toMargins(style.margin),
      color: style.color,
      backgroundColor: 'rgba(255, 0, 0, 0.08)' /* RED */,
      border: `dashed 1px ${Color.alpha(COLORS.MAGENTA, 0.1)}`,
      borderRadius: 3,

      padding: 10,
      position: 'relative',
      display: 'grid',
    }),
    emoji: css({ Absolute: [-8, null, null, -8] }),
    body: css({ fontSize: 13, display: 'grid', alignContent: 'center' }),

    message: {
      base: css({}),
      prefix: css({ fontWeight: 'bold', color: COLORS.MAGENTA }),
      text: css({
        color: isEmpty ? COLORS.MAGENTA : undefined,
        opacity: isEmpty ? 0.4 : 1,
      }),
    },
    html: css({}),
  };

  const elHtml = safeHtml && (
    <span
      {...styles.html}
      className={DEFAULTS.md.class.todo}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );

  const elMessage = (
    <div {...styles.message.base}>
      <span {...styles.message.prefix}>{isEmpty ? 'TODO' : 'TODO:'}</span>{' '}
      <span {...styles.message.text}>{elHtml}</span>
    </div>
  );

  return (
    <div {...styles.base}>
      <div {...styles.emoji}>{'🐷'}</div>
      <div {...styles.body}>{elMessage}</div>
    </div>
  );
};

/**
 * [Helpers]
 */
const Wrangle = {
  text(props: TodoProps) {
    return (props.text || '').trim();
  },
  isEmpty(props: TodoProps) {
    return !Boolean((props.text || '').trim());
  },
};

/**
 * Export
 */
type Fields = {
  DEFAULT: typeof DEFAULT;
};
export const Todo = FC.decorate<TodoProps, Fields>(View, { DEFAULT }, { displayName: 'Todo' });
