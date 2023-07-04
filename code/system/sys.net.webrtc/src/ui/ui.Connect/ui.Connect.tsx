import { WebRtcInfo } from '../ui.Info';
import { DEFAULTS, type t } from './common';

export const Connect: React.FC<t.ConnectProps> = (props) => {
  const { data = {} } = props;
  const fields = Wrangle.fields(props);
  return <WebRtcInfo fields={fields} client={props.client} data={data} />;
};

/**
 * Helpers
 */
const Wrangle = {
  fields(props: t.ConnectProps): t.WebRtcInfoField[] {
    const { edge = DEFAULTS.edge } = props;
    const connect: t.WebRtcInfoField = edge === 'Top' ? 'Connect.Top' : 'Connect.Bottom';
    return [connect, 'State.Shared', 'Group', 'Group.Peers'];
  },
};
