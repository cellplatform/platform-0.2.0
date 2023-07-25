import { useEffect, useState } from 'react';
import { css, type t } from './common';

export type DialogProps = {
  data?: t.RecordButtonDialog;
  isEnabled: boolean;
  state: t.RecordButtonState;
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
