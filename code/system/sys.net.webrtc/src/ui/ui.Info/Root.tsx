import { useState } from 'react';
import { DEFAULTS, FC, Pkg, PropList, type t } from './common';

import { useInfo } from './hooks/useInfo.mjs';
import { FieldGroup } from './ui.fields/Group';
import { FieldGroupList } from './ui.fields/Group.Peers';
import { FieldModuleVerify } from './ui.fields/Module.Verify';
import { FieldNamespace } from './ui.fields/Namespace';
import { FieldPeer } from './ui.fields/Peer';
import { FieldPeerConnections } from './ui.fields/Peer.Connections';
import { FieldSelf } from './ui.fields/Self';
import { FieldStateShared } from './ui.fields/State.Shared';

export type WebRtcInfoProps = {
  client?: t.WebRtcEvents;
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.WebRtcInfoField[];
  flipped?: boolean;
  data?: t.WebRtcInfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<WebRtcInfoProps> = (props) => {
  const { client, data = {}, fields = DEFAULTS.fields.defaults } = props;

  const info = useInfo(client);
  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);

  const items = PropList.builder<t.WebRtcInfoField>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => FieldModuleVerify({ fields, data }))
    .field('Self.Id', () => FieldSelf({ fields, data, info }))
    .field('Group', () => FieldGroup({ fields, data, info }))
    .field('Group.Peers', () => FieldGroupList({ fields, data, info, client, isOver }))
    .field('State.Shared', () => FieldStateShared({ fields, data, info }))
    .field('State.Shared.Namespace', () => FieldNamespace({ fields, data, info }))
    .field('Peer', () => FieldPeer({ fields, data, info }))
    .field('Peer.Connections', () => FieldPeerConnections({ fields, data, info }))
    .items(fields);

  return (
    <PropList
      style={props.style}
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      flipped={props.flipped}
      margin={props.margin}
      padding={props.card && items.length > 0 ? [20, 25] : undefined}
      onMouseEnter={over(true)}
      onMouseLeave={over(false)}
    />
  );
};

/**
 * Helpers
 */
const Wrangle = {
  title(props: WebRtcInfoProps) {
    const title = PropList.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const WebRtcInfo = FC.decorate<WebRtcInfoProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'WebRtcInfo' },
);
