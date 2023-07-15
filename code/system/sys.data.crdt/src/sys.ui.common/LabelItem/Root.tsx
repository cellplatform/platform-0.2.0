import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Time, type t } from './common';

import { Ref } from './Root.Ref';
import { View } from './Root.View';

export const LabelItem = forwardRef<t.LabelItemRef, t.LabelItemProps>((props, ref) => {
  const [itemRef, setItemRef] = useState<t.LabelItemRef>();
  const inputRef = useRef<t.TextInputRef>(null);
  useImperativeHandle(ref, () => Ref(inputRef));

  const focus = () => Time.delay(0, () => itemRef?.focus());

  /**
   * Lifecycle
   */
  useEffect(() => {
    const ref = Ref(inputRef);
    setItemRef(ref);
    if (props.focusOnReady) focus();
    props.onReady?.({ ref });
  }, []);

  useEffect(() => {
    if (props.focusOnEdit && Boolean(props.editing)) focus();
  }, [props.editing]);

  /**
   * Render
   */
  return <View {...props} inputRef={inputRef} />;
});
