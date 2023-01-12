import { useEffect, useState } from 'react';

import { css, t } from './common';
import { RecordButtonDialog, RecordButtonState } from './types';

export type DialogProps = {
  data?: RecordButtonDialog;
  isEnabled: boolean;
  state: RecordButtonState;
  borderRadius: number;
  style?: t.CssValue;
};

export const Dialog: React.FC<DialogProps> = (props) => {
  const { state, borderRadius, data } = props;
  const [elBody, setElBody] = useState<JSX.Element | undefined>();

  useEffect(() => {
    if (data && state === 'dialog') {
      const el = typeof data.element === 'object' ? data.element : data.element?.();
      setElBody(() => el);
    }
  }, [state, data]); // eslint-disable-line

  if (state !== 'dialog') return null;

  const styles = {
    base: css({
      Absolute: 0,
      borderRadius,
      overflow: 'hidden',
      boxSizing: 'border-box',
      display: 'flex',
    }),
  };
  return <div {...css(styles.base, props.style)}>{elBody}</div>;
};
