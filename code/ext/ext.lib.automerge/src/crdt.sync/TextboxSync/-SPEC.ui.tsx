import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, FC, rx, type t, TextInput } from '../../test.ui';
import { useDoc } from '../../ui/use';

export type LayoutProps = {
  docuri?: string;
  repo?: { store: t.Store; index: t.StoreIndexState };
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Layout: React.FC<LayoutProps> = (props) => {
  const { theme, repo } = props;
  const { doc } = useDoc(repo?.store, props.docuri);

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ color, display: 'grid', rowGap: '30px' }),
    textbox: css({ width: 220 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.textbox}>
        <Textbox theme={theme} />
      </div>
      <div></div>
      <div {...styles.textbox}>
        <Textbox theme={theme} />
      </div>
    </div>
  );
};

export type TextboxProps = { theme?: t.CommonTheme; style?: t.CssValue };
export const Textbox: React.FC<TextboxProps> = (props) => {
  const { theme } = props;
  const [value, setValue] = useState('');

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({
      color,
      Padding: [5, 10],
      borderBottom: `dashed 1px ${Color.alpha(COLORS.CYAN, 0.9)}`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <TextInput
        value={value}
        theme={theme}
        placeholder={'string (crdt)'}
        onReady={(e) => console.info('⚡️ onReady', e)}
        onChanged={(e) => setValue(e.to)}
      />
    </div>
  );
};
