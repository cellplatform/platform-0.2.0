import type { VirtuosoHandle, t } from './common';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { VirtualListRef } from './Ref';
import { DEFAULTS } from './common';
import { List } from './ui';

/**
 * A "virtual" (infinite) scrolling list.
 */
export const VirtualList = forwardRef<t.VirtualListRef, t.VirtualListProps>((props, ref) => {
  const { list } = props;

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const handleRef = useRef<t.VirtualListRef>();
  const createHandle = () => (handleRef.current = VirtualListRef({ list, virtuosoRef }));
  const getOrCreateHandle = () => handleRef.current || createHandle();

  useImperativeHandle(ref, getOrCreateHandle);
  useEffect(() => props.onReady?.(getOrCreateHandle()), []);

  return <List {...props} virtuosoRef={virtuosoRef} />;
});

/**
 * Meta
 */
VirtualList.displayName = DEFAULTS.displayName;
