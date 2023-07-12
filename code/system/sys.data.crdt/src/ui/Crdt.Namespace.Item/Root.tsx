import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Time, type t } from './common';

import { Ref } from './Root.Ref';
import { View } from './Root.View';

export const CrdtNamespaceItem = forwardRef<t.CrdtNamespaceItemRef, t.CrdtNamespaceItemProps>(
  (props, ref) => {
    const inputRef = useRef<t.TextInputRef>(null);
    useImperativeHandle(ref, () => Ref(inputRef));

    useEffect(() => {
      const ref = Ref(inputRef);
      if (props.focusOnReady) Time.delay(0, () => ref.focus());
      props.onReady?.({ ref });
    }, []);

    return <View {...props} inputRef={inputRef} />;
  },
);
