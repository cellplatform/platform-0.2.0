import { useEffect, useRef, useState } from 'react';
import { Keyboard, Color, COLORS, css, t, rx, Dev } from './common';
import { CmdBar } from './ui.CmdBar';

export type CmdHostProps = {
  specs?: t.SpecImports;
  style?: t.CssValue;
};

export const CmdHost: React.FC<CmdHostProps> = (props) => {
  const { specs } = props;

  const [text, setText] = useState('');

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    body: css({
      position: 'relative',
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <Dev.SpecList imports={specs} />
      </div>
      <CmdBar text={text} onChanged={(e) => setText(e.to)} />
    </div>
  );
};
