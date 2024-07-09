import { View as CmdBar } from '../CmdBar/ui';
import { type t } from './common';
import { useController } from './use.Controller';

export const View: React.FC<t.CmdBarStatefulProps> = (props) => {
  const controller = useController(props);
  const ctrl = controller.ctrl?._;
  return (
    <CmdBar
      {...props}
      {...controller.handlers}
      cmd={ctrl}
      text={controller.text}
      hintKey={controller.hintKey}
      enabled={controller.enabled}
    />
  );
};
