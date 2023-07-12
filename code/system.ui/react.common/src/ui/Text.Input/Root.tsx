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
    const ref = TextInputRef(inputRef);
    if (props.focusOnReady) Time.delay(0, () => ref.focus());
    props.onReady?.(ref);
  }, []);

  return <TextInputBase {...props} inputRef={inputRef} />;
});
