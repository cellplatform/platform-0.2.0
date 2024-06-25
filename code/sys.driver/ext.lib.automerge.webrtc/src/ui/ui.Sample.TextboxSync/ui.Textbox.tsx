import { useEffect, useState } from 'react';
import { COLORS, Color, ObjectPath, Sync, TextInput, css, rx, type t } from '../../test.ui';

/**
 * <Textbox>
 */
export type TextboxProps = {
  doc?: t.Lens;
  path?: t.ObjectPath;
  focus?: boolean;
  debug?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const Textbox: React.FC<TextboxProps> = (props) => {
  const { doc, theme, debug, path = [] } = props;
  const enabled = !!doc;

  const [value, setValue] = useState('');
  const [input, setInput] = useState<t.TextInputRef>();

  useEffect(() => {
    const life = rx.disposable();
    const { dispose$ } = life;
    if (doc && input) {
      const initial = ObjectPath.resolve<string>(doc.current, path);
      setValue(initial ?? '');
      const listener = Sync.Textbox.listen(input, doc, path, { debug, dispose$ });
      listener.onChange((e) => setValue(e.text));
    }
    return life.dispose;
  }, [doc?.instance, !!input, path?.join('.')]);

  /**
   * Render
   */
  const color = Color.theme(theme).fg;
  const styles = {
    base: css({
      color,
      position: 'relative',
      Padding: [5, 7],
      borderBottom: `dashed 1px ${Color.alpha(COLORS.CYAN, enabled ? 0.9 : 0.2)}`,
    }),
    debug: css({
      Absolute: [3, null, 0, -30],
      display: 'grid',
      placeItems: 'center',
      fontSize: 22,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.debug}>{debug}</div>
      <TextInput
        value={value}
        theme={theme}
        isEnabled={enabled}
        placeholder={'string (crdt)'}
        focusOnReady={props.focus}
        spellCheck={false}
        onReady={(e) => setInput(e.ref)}
        onChange={(e) => setValue(e.to)}
      />
    </div>
  );
};
