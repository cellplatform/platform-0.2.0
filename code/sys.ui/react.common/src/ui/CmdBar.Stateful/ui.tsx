import { View as CmdBar } from '../CmdBar/ui';

import { type t } from './common';
import { useController } from './use.Controller';

export const View: React.FC<t.CmdBarStatefulProps> = (props) => {
  const controller = useController(props);
  return (
    <CmdBar
      //
      {...props}
      {...controller.handlers}
      text={controller.text}
      enabled={controller.enabled}
    />
  );
};
