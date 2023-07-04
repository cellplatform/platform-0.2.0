import { type t } from './common';
import { Connect } from './ui.Connect';
import { useController } from './useController.mjs';

export const ConnectStateful: React.FC<t.ConnectStatefulProps> = (props) => {
  const { self, edge, style, onChange } = props;
  const controller = useController({ self, onChange });
  return <Connect edge={edge} data={controller.data} style={style} />;
};
