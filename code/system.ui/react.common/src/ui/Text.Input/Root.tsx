import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Time, type t } from './common';

import { TextInputRef } from './Root.Ref.mjs';
import { TextInputBase } from './Root.View';

/**
 * A simple HTML text input primitive.
 */
export const TextInput = forwardRef<t.TextInputRef, t.TextInputProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => TextInputRef(inputRef));

  useEffect(() => {
    const { focusOnReady, selectOnReady } = props;
    const ref = TextInputRef(inputRef);
    if (focusOnReady) Time.delay(0, () => ref.focus(selectOnReady));
    props.onReady?.(ref);
  }, []);

  return <TextInputBase {...props} inputRef={inputRef} />;
});
