import { useEffect, useState } from 'react';

import { COLORS, css, DEFAULTS, FC, Style, t, TextProcessor } from '../common';
import { DEFAULT } from './ui.Todo.DEFAULT.mjs';

export type TodoProps = {
  text?: string;
  style?: t.DevTodoStyle;
};

const View: React.FC<TodoProps> = (props) => {
  const style = { ...DEFAULT.style, ...props.style };
  const text = Wrangle.text(props);
  const isEmpty = Wrangle.isEmpty(props);

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
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      color: style.color,
      padding: 8,
      display: 'grid',
      gridTemplateColumns: `auto 1fr`,
    }),
    left: css({ marginRight: 6 }),
    right: css({ fontSize: 13, display: 'grid', alignContent: 'center' }),
    todo: css({ fontWeight: 'bold', color: COLORS.MAGENTA }),
    text: css({
      fontStyle: 'italic',
      color: isEmpty ? COLORS.MAGENTA : undefined,
      opacity: isEmpty ? 0.4 : 1,
    }),
    html: css({}),
  };

  const elHtml = safeHtml && (
    <div
      {...styles.html}
      className={DEFAULTS.MD.CLASS.TODO}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );

  const elMessage = (
    <div>
      <span {...styles.todo}>{isEmpty ? 'TODO' : 'TODO:'}</span>{' '}
      <span {...styles.text}>{elHtml}</span>
    </div>
  );

  return (
    <div {...styles.base}>
      <div {...styles.left}>{'🐷'}</div>
      <div {...styles.right}>{elMessage}</div>
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
