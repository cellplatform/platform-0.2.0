import { useEffect, useState } from 'react';
import { TextboxSync } from '.';
import { COLORS, Color, ObjectPath, TextInput, css, rx, type t } from '../../test.ui';
import { useDoc } from '../../ui/use';

export type TDoc = {
  text?: string;
  foo?: { text?: string };
};

/**
 * <Layout>
 */
export type LayoutProps = {
  repo?: { store: t.Store; index: t.StoreIndexState };
  docuri?: string;
  path?: t.ObjectPath;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const Layout: React.FC<LayoutProps> = (props) => {
  const { theme, repo, path } = props;
  const doc = useDoc<TDoc>(repo?.store, props.docuri).ref;

  /**
   * Render
   */
  const color = Color.theme(theme).fg;
  const styles = {
    base: css({ color, display: 'grid', rowGap: '30px', userSelect: 'none' }),
    textbox: css({ width: 260 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.textbox}>
        <Textbox debug={'🐷'} theme={theme} doc={doc} path={path} focus={true} />
      </div>
      <div></div>
      <div {...styles.textbox}>
        <Textbox debug={'🌼'} theme={theme} doc={doc} path={path} />
      </div>
    </div>
  );
};

/**
 * <Textbox>
 */
export type TextboxProps = {
  doc?: t.DocRef<TDoc>;
  path?: t.ObjectPath;
  focus?: boolean;
  debug?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const Textbox: React.FC<TextboxProps> = (props) => {
  const { focus, doc, theme, debug, path = [] } = props;
  const enabled = !!doc;

  const [value, setValue] = useState('');
  const [input, setInput] = useState<t.TextInputRef>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const life = rx.disposable();
    const { dispose$ } = life;
    if (doc && input) {
      const initial = ObjectPath.resolve<string>(doc.current, path);
      setValue(initial ?? '');

      const listener = TextboxSync.listen(input, doc, path, { debug, dispose$ });
      listener.onChange((e) => setValue(e.text));
    }
    return life.dispose;
  }, [doc?.uri, !!input, path?.join('.')]);

  useEffect(() => {
    if (focus && input && doc) input.focus();
  }, [focus, !!input, !!doc]);

  /**
   * Render
   */
  const color = Color.theme(theme).fg;
  const styles = {
    base: css({
      position: 'relative',
      color,
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
        spellCheck={false}
        onReady={(e) => setInput(e.ref)}
        onChange={(e) => setValue(e.to)}
      />
    </div>
  );
};
