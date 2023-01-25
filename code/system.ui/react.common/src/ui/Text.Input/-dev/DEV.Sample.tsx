import { useEffect, useState } from 'react';

import { TextInput } from '..';
import { t } from '../common';

export type DevSampleProps = {
  props: t.TextInputProps;
  debug: { hint: boolean; updateHandlerEnabled: boolean };
};

export const DevSample: React.FC<DevSampleProps> = (args) => {
  const { props, debug } = args;

  const [value, setValue] = useState(props.value);
  const [hint, setHint] = useState(props.hint);

  useEffect(() => setValue(props.value), [props.value]);

  /**
   * [Render]
   */
  return (
    <TextInput
      {...props}
      value={value}
      hint={debug.hint ? hint : undefined}
      onEnter={(e) => {
        console.info('⚡️ onEnter');
      }}
      onEscape={(e) => {
        console.info('⚡️ onEscape');
      }}
      onChange={(e) => {
        if (!debug.updateHandlerEnabled) return;

        setValue(e.to);
        if (debug.hint) setHint(DevUtil.lookupHint(e.to ?? ''));
      }}
    />
  );
};

/**
 * Helpers
 */

const HINTS = [
  'cartography',
  'catamaran',
  'sovereign',
  'soul',
  'hellacious',
  'helpful',
  'heretofore',
].sort();

const DevUtil = {
  lookupHint(value: string) {
    const hint = HINTS.find((item) => item.startsWith(value.toLowerCase()));
    return hint ? hint.substring(value.length) : undefined;
  },
};
