import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { type t } from './common';
import { View } from './ui';

/**
 * Stateful <CmdBar>
 */
export const CmdBarStateful = forwardRef<t.CmdBarCtrl, t.CmdBarStatefulProps>((props, ref) => {
  const [count, setCount] = useState(0);
  const innerRef = useRef<t.CmdBarCtrl | undefined>(undefined);

  useImperativeHandle(ref, () => innerRef.current as t.CmdBarCtrl, [count]);

  return (
    <View
      {...props}
      onReady={(e) => {
        innerRef.current = e.cmdbar;
        setCount((n) => n + 1);
        props.onReady?.(e);
      }}
    />
  );
});
