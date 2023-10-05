import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Time, type t } from './common';

import { Ref } from './Ref';
import { View } from './ui';

export const ForwardRef = forwardRef<t.LabelItemRef, t.LabelItemProps>((props, ref) => {
  const [itemRef, setItemRef] = useState<t.LabelItemRef>();
  const inputRef = useRef<t.TextInputRef>(null);
  useImperativeHandle(ref, () => Ref(inputRef));
  const focusTextbox = () => Time.delay(0, () => itemRef?.focus());

  /**
   * Lifecycle
   */
  useEffect(() => {
    const ref = Ref(inputRef);
    setItemRef(ref);
    if (props.focusOnReady) focusTextbox();
    props.onReady?.({ ref });
  }, []);

  useEffect(() => {
    if (props.focusOnEdit && props.editing) focusTextbox();
  }, [props.focusOnEdit, props.editing]);

  /**
   * Render
   */
  return <View {...props} inputRef={inputRef} />;
});
