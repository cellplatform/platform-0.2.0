import { type t } from './common';
import { Connect } from './ui.Connect';
import { useConnectController } from './useConnectController.mjs';

export const ConnectStateful: React.FC<t.ConnectStatefulProps> = (props) => {
  const { self, edge, style, onChange } = props;
  const controller = useConnectController({ self, onChange });
  return <Connect edge={edge} client={controller.client} data={controller.data} style={style} />;
};
