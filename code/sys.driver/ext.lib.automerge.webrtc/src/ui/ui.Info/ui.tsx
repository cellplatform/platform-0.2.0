import { PropList, usePeerMonitor, useShared, useTransmitMonitor, type t } from './common';
import { Field } from './field';
import { Wrangle } from './u';
import { useRedraw } from './use.Redraw';

type P = t.InfoProps;

/**
 * Component
 */
export const View: React.FC<P> = (props) => {
  const { theme, network, data = {} } = props;
  const ctx = Wrangle.ctx(props);

  useRedraw(props);
  const shared = useShared(network);
  const { bytes } = usePeerMonitor(network);
  const { isTransmitting } = useTransmitMonitor(bytes.total);

  const items = PropList.builder<t.InfoField>()
    .field('Visible', () => Field.visible(data.visible, props.onVisibleToggle))
    .field('Module', () => Field.module(ctx))
    .field('Module.Verify', () => Field.moduleVerify(ctx))
    .field('Component', () => Field.component(ctx, data.component))
    .field('Peer', () => Field.peer(ctx, network))
    .field('Repo', () => Field.repo(ctx, network))
    .field('Network.Shared', () => Field.network.shared(ctx, data, network, shared?.doc))
    .field('Network.Transfer', () => Field.network.transfer(ctx, bytes, isTransmitting))
    .items(ctx.fields);

  return (
    <PropList
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      margin={props.margin}
      theme={theme}
      style={props.style}
    />
  );
};
