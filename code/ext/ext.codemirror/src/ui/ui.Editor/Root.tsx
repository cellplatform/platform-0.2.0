import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

import { EditorView, minimalSetup, basicSetup } from 'codemirror';

const View: React.FC<t.RootProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const parent = ref.current;

    if (parent) {
      dispose$.subscribe(() => editor.destroy());
      const editor = new EditorView({
        extensions: [basicSetup],
        parent,
      });
    }

    return dispose;
  }, [ref.current]);

  /**
   * [Render]
   */
  const styles = {
    base: css({ padding: 5, fontSize: 14 }),
  };

  return <div ref={ref} {...css(styles.base, props.style)}></div>;
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Root = FC.decorate<t.RootProps, Fields>(View, { DEFAULTS }, { displayName: 'Root' });
