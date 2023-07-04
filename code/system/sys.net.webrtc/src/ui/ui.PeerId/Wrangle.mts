import { WebRtc } from '../../WebRtc';
import { type t } from './common';

/**
 * [Helpers]
 */
export const Wrangle = {
  uri(props: t.PeerIdProps) {
    return props.peer ? WebRtc.Util.asUri(props.peer) : '';
  },

  id(props: t.PeerIdProps) {
    const { abbreviate } = props;
    const id = props.peer ? WebRtc.Util.asId(props.peer) : '';

    if (!abbreviate && typeof abbreviate !== 'number' && !Array.isArray(abbreviate)) {
      return id;
    }

    if (Array.isArray(abbreviate)) {
      const prefix = id.slice(0, abbreviate[0]);
      const suffix = id.slice(0 - abbreviate[1]);
      return `${prefix}..${suffix}`;
    }

    const length = abbreviate === true ? 5 : abbreviate;
    const suffix = id.slice(-length);
    return suffix;
  },

  peerText(props: t.PeerIdProps) {
    if (!props.peer) return 'peer:initiating...';
    const id = Wrangle.id(props);
    const prefix = (props.prefix ?? '').trim();
    return prefix ? `${prefix.replace(/\:$/, '')}:${id}` : WebRtc.Util.asUri(id);
  },
};
