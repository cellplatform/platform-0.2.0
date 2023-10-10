import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Time, type t } from './common';
import { Wrangle } from './Wrangle';

import { Ref } from './Ref';
import { View } from './ui';

export const ForwardRef = forwardRef<t.LabelItemRef, t.LabelItemProps>((props, ref) => {
  const { index, total, editing } = Wrangle.valuesOrDefault(props);
  const [itemRef, setItemRef] = useState<t.LabelItemRef>();
  const inputRef = useRef<t.TextInputRef>(null);
  const focusTextbox = () => Time.delay(0, () => itemRef?.focus());
  useImperativeHandle(ref, () => Ref(inputRef));

  /**
   * Lifecycle
   */
  useEffect(() => {
    const ref = Ref(inputRef);
    setItemRef(ref);
    if (props.focusOnReady) focusTextbox();
    props.onReady?.({ ref, position: { index, total } });
  }, []);

  useEffect(() => {
    if (props.focusOnEdit && editing) focusTextbox();
  }, [props.focusOnEdit, editing]);

  /**
   * Render
   */
  return <View {...props} inputRef={inputRef} />;
});
