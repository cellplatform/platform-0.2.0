import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { TextInputRef } from './Ref';
import { Time, type t } from './common';
import { View } from './ui';

/**
 * A simple HTML text input primitive.
 */
export const TextInput = forwardRef<t.TextInputRef, t.TextInputProps>((props, ref) => {
  const readyRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useRef<t.TextInputRef>();
  const createHandle = () => (handleRef.current = TextInputRef(inputRef));
  const getOrCreateHandle = () => handleRef.current || createHandle();

  useImperativeHandle(ref, getOrCreateHandle);

  useEffect(() => {
    const { focusOnReady, selectOnReady } = props;
    const ref = getOrCreateHandle();
    if (focusOnReady) Time.delay(0, () => ref.focus(selectOnReady));
    if (!readyRef.current) {
      readyRef.current = true;
      const input = inputRef.current!;
      props.onReady?.({ ref, input });
    }
  }, []);

  return <View {...props} inputRef={inputRef} />;
});
