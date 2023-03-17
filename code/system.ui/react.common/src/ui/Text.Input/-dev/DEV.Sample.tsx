import { useEffect, useRef, useState } from 'react';

import { TextInput } from '..';
import { Time, t } from '../common';
import { Hints } from './DEV.Hints.mjs';

export type DevSampleProps = {
  props: t.TextInputProps;
  debug: {
    isHintEnabled: boolean;
    isUpdateEnabled: boolean;
    isUpdateAsync: boolean;
  };
  onReady: t.TextInputReadyHandler;
};

export const DevSample: React.FC<DevSampleProps> = (dev) => {
  const { debug } = dev;

  const inputRef = useRef<t.TextInputRef>(null);
  const [value, setValue] = useState(dev.props.value);
  const [hint, setHint] = useState(dev.props.hint);

  /**
   * Lifecycle
   */
  useEffect(() => setValue(dev.props.value), [dev.props.value]);

  /**
   * [Render]
   */
  return (
    <TextInput
      {...dev.props}
      ref={inputRef}
      value={value}
      hint={debug.isHintEnabled ? hint : undefined}
      onReady={dev.onReady}
      onEnter={(e) => {
        console.info('⚡️ onEnter', e);
      }}
      onEscape={(e) => {
        console.info('⚡️ onEscape', e);
      }}
      onChanged={async (e) => {
        if (debug.isUpdateAsync) await Time.wait(0); // NB: simulate an async break between a controller updating state, and the component re-rendering.
        if (debug.isUpdateEnabled) {
          setValue(e.to);
          if (debug.isHintEnabled) setHint(Hints.lookup(e.to ?? ''));
        } else {
          setHint('');
        }
        // console.info('⚡️ onChanged', e);
      }}
      onLabelDoubleClick={(e) => {
        console.info('⚡️ onLabelDoubleClick', e);
      }}
    />
  );
};
