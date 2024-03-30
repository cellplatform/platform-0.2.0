import { useEffect, useRef, useState } from 'react';
import { COLORS, Color, TextInput, css, rx, type t } from '../../test.ui';
import { useDoc } from '../../ui/use';
import { listen, type TDoc } from './-SPEC.ui.splice';

export type { TDoc };

/**
 * <Layout>
 */
export type LayoutProps = {
  docuri?: string;
  repo?: { store: t.Store; index: t.StoreIndexState };
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const Layout: React.FC<LayoutProps> = (props) => {
  const { theme, repo } = props;
  const { doc } = useDoc<TDoc>(repo?.store, props.docuri);

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ color, display: 'grid', rowGap: '30px', userSelect: 'none' }),
    textbox: css({ width: 260 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.textbox}>
        <Textbox theme={theme} doc={doc} debug={'🐷'} focus={true} />
      </div>
      <div></div>
      <div {...styles.textbox}>
        <Textbox theme={theme} doc={doc} debug={'🌼'} />
      </div>
    </div>
  );
};

/**
 * <Textbox>
 */
export type TextboxProps = {
  doc?: t.DocRef<TDoc>;
  focus?: boolean;
  debug?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const Textbox: React.FC<TextboxProps> = (props) => {
  const { doc, theme, debug } = props;

  const changeRef$ = useRef(rx.subject<t.TextInputChangeArgs>());
  const [value, setValue] = useState('');
  const [input, setInput] = useState<t.TextInputRef>();

  useEffect(() => {
    const life = rx.lifecycle();
    const input$ = changeRef$.current;
    if (doc && input) {
      setValue(doc.current.text || '');
      listen(doc, input, input$, life.dispose$, {
        debug,
        onChange(e) {
          setValue(e.text);
        },
      });
    }
    return life.dispose;
  }, [doc?.uri, !!input]);

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({
      position: 'relative',
      color,
      Padding: [5, 7],
      borderBottom: `dashed 1px ${Color.alpha(COLORS.CYAN, 0.9)}`,
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
        placeholder={'string (crdt)'}
        focusOnReady={props.focus}
        spellCheck={false}
        onReady={(e) => {
          console.info('⚡️ onReady', e);
          setInput(e.ref);
        }}
        onChange={(e) => {
          changeRef$.current.next(e);
          setValue(e.to);
        }}
      />
    </div>
  );
};
