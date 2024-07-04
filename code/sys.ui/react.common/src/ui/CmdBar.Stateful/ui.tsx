import { View as CmdBar } from '../CmdBar/ui';
import { type t } from './common';

export const View: React.FC<t.CmdBarStatefulProps> = (props) => {
  /**
   * Handlers
   */
  const handleReady: t.CmdBarStatefulReadyHandler = (e) => {
    props.onReady?.({ ...e });
  };

  /**
   * Render
   */
  return <CmdBar {...props} onReady={handleReady} />;
};
