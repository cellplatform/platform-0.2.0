import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { type t, type VirtuosoHandle } from './common';
import { VirtualListRef } from './Ref';
import { View } from './ui';

/**
 * A "virtual" (infinite) scrolling list
 */
export const VirtualList = forwardRef<t.VirtualListRef, t.VirtualListProps>((props, ref) => {
  const { list } = props;

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const handleRef = useRef<t.VirtualListRef>();
  const createHandle = () => (handleRef.current = VirtualListRef({ list, virtuosoRef }));
  const getOrCreateHandle = () => handleRef.current || createHandle();

  useImperativeHandle(ref, getOrCreateHandle);
  useEffect(() => props.onReady?.(getOrCreateHandle()), []);

  return <View {...props} virtuosoRef={virtuosoRef} />;
});
