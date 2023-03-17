import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';

import { t, Time } from './common';
import { TextInputRef } from './TextInput.Ref.mjs';
import { TextInputBase } from './ui.TextInput.Base';

/**
 * A simple HTML text input primitive
 */
export const TextInput = forwardRef<t.TextInputRef, t.TextInputProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => TextInputRef(inputRef));

  useEffect(() => {
    const ref = TextInputRef(inputRef);
    if (props.focusOnLoad) Time.delay(0, () => ref.focus());
    props.onReady?.(ref);
  }, []);

  return <TextInputBase {...props} inputRef={inputRef} />;
});
