import { R, type t, WebRtcUtils, DEFAULTS } from './common';

export const Wrangle = {
  ids(props: t.ConnectInputProps) {
    const local = (props.self?.id ?? '').trim();
    const remote = WebRtcUtils.asId(props.remote ?? '');
    return { local, remote };
  },

  canConnect(props: t.ConnectInputProps) {
    const fields = Wrangle.fields(props);
    if (!props.self || !fields.includes('Peer:Remote')) return false;

    const { local, remote } = Wrangle.ids(props);
    if (!remote) return false;
    if (local === remote) return false;
    if (Wrangle.isConnected(props)) return false;

    return true;
  },

  isConnected(props: t.ConnectInputProps) {
    const { remote } = Wrangle.ids(props);
    if (props.spinning) return false;
    return props.self?.connections.all.some((conn) => conn.peer.remote === remote) ?? false;
  },

  fields(props: t.ConnectInputProps) {
    const { fields = DEFAULTS.fields } = props;
    return R.uniq(fields);
  },

  idFields(props: t.ConnectInputProps) {
    const fields = Wrangle.fields(props);
    const include: t.ConnectInputField[] = ['Peer:Self', 'Peer:Remote'];
    return fields.filter((field) => include.includes(field));
  },
};
