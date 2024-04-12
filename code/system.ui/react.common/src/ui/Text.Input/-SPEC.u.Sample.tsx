import { useEffect, useRef, useState } from 'react';
import { TextInput } from '.';
import { Color, Time, css, type t } from '../common';

export type SampleProps = {
  props: t.TextInputProps;
  debug: {
    isHintEnabled: boolean;
    isUpdateEnabled: boolean;
    isUpdateAsync: boolean;
    elementPlaceholder: boolean;
  };
};

export const Sample: React.FC<SampleProps> = (dev) => {
  const { debug, props } = dev;
  const inputRef = useRef<t.TextInputRef>(null);

  /**
   * Manage value state
   * NB: done to simulate immediate (sync) updates.
   */
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);

  /**
   * [Render]
   */
  const styles = {
    placeholder: css({ display: 'grid', gridTemplateColumns: 'auto auto 1fr', columnGap: 10 }),
    label: css({ fontStyle: 'normal', display: 'grid', alignContent: 'center' }),
    key: css({
      fontSize: 10,
      borderRadius: 5,
      border: `solid 1px ${Color.format(-0.4)}`,
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
      hint={props.hint}
      placeholder={debug.elementPlaceholder ? elPlaceholder : props.placeholder}
      onChange={async (e) => {
        if (debug.isUpdateAsync) await Time.wait(0); // NB: simulate an async break between a controller updating state, and the component re-rendering.
        if (debug.isUpdateEnabled) setValue(e.to);
        props.onChange?.(e);
      }}
    />
  );
};
