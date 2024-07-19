import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { ConnectorRef } from './Ref';
import { DEFAULTS, Model, type t } from './common';
import { View } from './ui';

/**
 * A UI for configuring Peer connections.
 */
export const Connector = forwardRef<t.ConnectorRef, t.ConnectorProps>((props, ref) => {
  const { peer } = props;

  const handleRef = useRef<t.ConnectorRef>();
  const modelRef = useRef(Model.List.init(peer));
  const list = modelRef.current.list;

  const createHandle = () => (handleRef.current = ConnectorRef({ peer, list }));
  const getOrCreateHandle = () => handleRef.current || createHandle();

  useImperativeHandle(ref, getOrCreateHandle);
  useEffect(() => {
    const ref = getOrCreateHandle();
    props.onReady?.({ ref });
  }, []);

  return <View {...props} list={list} />;
});

/**
 * Meta
 */
Connector.displayName = DEFAULTS.displayName;
