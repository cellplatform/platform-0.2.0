import { useRef } from 'react';
import { VirtualList } from '.';
import { type t } from '../../test.ui';

export const SampleView: React.FC<t.VirtualListProps> = (props) => {
  /**
   * DEBUG NOTE:
   *    Wrapped in <SampleView> to test passing in a ref.
   */
  const ref = useRef<t.VirtualListRef>(null);
  // const ref = undefined;
  return <VirtualList {...props} ref={ref} />;
};
