import { useEffect, useRef, useState } from 'react';

import { TextInput } from '..';
import { css, Color, Time, type t } from '../common';
import { Hints } from './DEV.Hints.mjs';

export type DevSampleProps = {
  props: t.TextInputProps;
  debug: {
    isHintEnabled: boolean;
    isUpdateEnabled: boolean;
    isUpdateAsync: boolean;
    elementPlaceholder: boolean;
  };
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
  const styles = {
    placeholder: css({
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr',
      columnGap: 10,
    }),
    label: css({
      fontStyle: 'normal',
      display: 'grid',
      alignContent: 'center',
    }),
    key: css({
      fontSize: 10,
      border: `solid 1px ${Color.format(-0.4)}`,
      // backgroundColor: Color.format(1),
      borderRadius: 5,
      fontStyle: 'normal',
      fontWeight: 600,
      display: 'grid',
      placeItems: 'center',
      PaddingX: 5,
    }),
  };

  const elPlaceholder = (
    <div {...styles.placeholder}>
      <div {...styles.label}>custom placeholder</div>
      <div {...styles.key}>⌘K</div>
    </div>
  );

  return (
    <TextInput
      {...dev.props}
      ref={inputRef}
      value={value}
      hint={debug.isHintEnabled ? hint : undefined}
      placeholder={debug.elementPlaceholder ? elPlaceholder : dev.props.placeholder}
      onChanged={async (e) => {
        if (debug.isUpdateAsync) await Time.wait(0); // NB: simulate an async break between a controller updating state, and the component re-rendering.
        if (debug.isUpdateEnabled) {
          setValue(e.to);
          if (debug.isHintEnabled) setHint(Hints.lookup(e.to ?? ''));
        } else {
          setHint('');
        }
        console.info('⚡️ onChanged', e);
        dev.props.onChanged?.(e);
      }}
    />
  );
};
