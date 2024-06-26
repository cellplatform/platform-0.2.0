import { useEffect, useState } from 'react';
import { TextboxSync } from '.';
import { COLORS, Color, ObjectPath, TextInput, css, rx, type t } from '../../test.ui';
import { useDoc } from '../../ui/ui.use';

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
  const { theme, repo, docuri, path } = props;

  /**
   * Render
   */
  const color = Color.theme(theme).fg;
  const styles = {
    base: css({ color, display: 'grid', rowGap: '30px', userSelect: 'none' }),
    textbox: css({ width: 260 }),
  };

  const textbox = (debug: string, focus?: boolean) => (
    <Textbox debug={debug} focus={focus} repo={repo} docuri={docuri} path={path} theme={theme} />
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.textbox}>{textbox('🐷', true)}</div>
      <div></div>
      <div {...styles.textbox}>{textbox('🌼')}</div>
    </div>
  );
};

/**
 * <Textbox>
 */
export type TextboxProps = {
  repo?: { store: t.Store; index: t.StoreIndexState };
  docuri?: string;
  path?: t.ObjectPath;
  focus?: boolean;
  debug?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const Textbox: React.FC<TextboxProps> = (props) => {
  const { repo, focus, theme, debug, path = [] } = props;

  const doc = useDoc<TDoc>(repo?.store, props.docuri).ref;
  const enabled = !!doc;

  const [text, setText] = useState('');
  const [textbox, setTextbox] = useState<t.TextInputRef>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const life = rx.disposable();
    const { dispose$ } = life;
    if (doc && textbox) {
      const initial = ObjectPath.resolve<string>(doc.current, path);
      setText(initial ?? '');

      const listener = TextboxSync.listen(textbox, doc, path, { debug, dispose$ });
      listener.onChange((e) => setText(e.text));
    }
    return life.dispose;
  }, [doc?.uri, !!textbox, path?.join('.')]);

  useEffect(() => {
    if (focus && textbox && doc) textbox.focus();
  }, [focus, !!textbox, !!doc]);

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
        value={text}
        theme={theme}
        isEnabled={enabled}
        placeholder={'string (crdt)'}
        spellCheck={false}
        onReady={(e) => setTextbox(e.ref)}
        onChange={(e) => setText(e.to)}
      />
    </div>
  );
};
