import { useRef } from 'react';
import { CmdBar } from '../CmdBar';
import { type t } from './common';

export const Sample: React.FC<t.CmdBarStatefulProps> = (props) => {
  /**
   * Example [useRef].
   */
  const ref = useRef<t.CmdBarRef>(null);
  return <CmdBar.Stateful ref={ref} {...props} />;
};
