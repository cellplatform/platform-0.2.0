import { memo } from 'react';
import { R, type t } from './common';
import { View } from './ui';

/**
 * A memoized wrapper of the base <View>.
 */
export const MemoView = memo<t.RepoListProps>(
  (props) => <View {...props} />,
  (prev, next) => {
    // NB: prevent re-renders.
    return (
      prev.newlabel === next.newlabel &&
      prev.tabIndex === next.tabIndex &&
      R.equals(prev.renderCount, next.renderCount)
    );
  },
);
