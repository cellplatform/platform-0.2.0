import { DEFAULTS, FC, PeerInfo, PropList, type t } from './common';
import { Field } from './field';
import { peer } from './field.Peer';

/**
 * Component
 */
const View: React.FC<t.InfoProps> = (props) => {
  const { fields = DEFAULTS.fields.default, data = {} } = props;

  PeerInfo.useRedraw(data);

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module())
    .field('Module.Verify', () => Field.moduleVerify())
    .field('Component', () => Field.component(data.component))
    .field('Peer', () => peer(data.peer, fields))
    .field('Repo', () => Field.repo(data.repo))
    .items(fields);

  return (
    <PropList
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      flipped={props.flipped}
      padding={props.card ? [20, 25, 30, 25] : undefined}
      margin={props.margin}
      style={props.style}
    />
  );
};

/**
 * Helpers
 */
const Wrangle = {
  title(props: t.InfoProps) {
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
export const Info = FC.decorate<t.InfoProps, Fields>(View, { DEFAULTS }, { displayName: 'Info' });
