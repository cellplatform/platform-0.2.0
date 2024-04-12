import { useEffect, useState } from 'react';
import { CmdHost } from 'sys.ui.react.common';
import { Specs } from '../../test.ui/entry.Specs.mjs';
import { Color, ObjectPath, Sync, css, rx, type t } from './common';

export type SampleProps = {
  pkg: t.ModuleDef;
  doc?: t.Lens;
  path?: t.ObjectPath;
  theme?: t.CommonTheme;
  enabled?: boolean;
  debug?: string;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const { theme, enabled = true, doc, path = [] } = props;

  const [value, setValue] = useState('');
  const [input, setInput] = useState<t.TextInputRef>();

  useEffect(() => {
    const life = rx.disposable();
    const { dispose$ } = life;
    if (doc && input) {
      const initial = ObjectPath.resolve<string>(doc.current, path);
      const listener = Sync.Textbox.listen(input, doc, path, { dispose$ });
      listener.onChange((e) => setValue(e.text));
      setValue(initial ?? '');
    }
    return life.dispose;
  }, [doc?.instance, !!input, path?.join('.')]);

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      color,
    }),
    debug: css({
      Absolute: [-12, null, null, -12],
      display: 'grid',
      placeItems: 'center',
      fontSize: 22,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <CmdHost.Stateful
        enabled={enabled}
        pkg={props.pkg}
        specs={Specs}
        command={value}
        mutateUrl={false}
        autoGrabFocus={false}
        theme={theme}
        listMinWidth={300}
        onReady={(e) => setInput(e.input)}
      />
      <div {...styles.debug}>{props.debug}</div>
    </div>
  );
};
