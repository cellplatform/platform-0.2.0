import { useEffect, useRef, useState } from 'react';
import { CmdBar } from 'sys.ui.react.common';
import { Sync, css, rx, type t } from './common';

export type DevCmdBarProps = {
  doc?: t.Lens<t.HarnessShared>;
  style?: t.CssValue;
};

export const DevCmdBar: React.FC<DevCmdBarProps> = (props) => {
  const { doc } = props;
  const enabled = !!doc?.instance;
  const textboxRef = useRef<t.TextInputRef>();

  console.log('doc?.instance', doc?.instance);

  const [text, setText] = useState('');

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const textbox = textboxRef.current;

    if (textbox && doc) {
      const listener = Sync.Textbox.listen(textbox, doc, ['cmdbar'], { dispose$ });

      console.log('listener', listener);

      listener.onChange((e) => {
        console.log('onChange', e);
        setText(e.text);
      });
    }

    console.log('Sync', Sync);
    setText(doc?.current.cmdbar ?? '');
    return dispose;
  }, [doc?.instance, !!textboxRef.current]);

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid' }),
  };

  console.log('render:text:', text);

  return (
    <div {...css(styles.base, props.style)}>
      <CmdBar text={text} enabled={enabled} onReady={({ ref }) => (textboxRef.current = ref)} />
    </div>
  );
};
