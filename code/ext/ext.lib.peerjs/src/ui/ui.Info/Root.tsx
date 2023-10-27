import { DEFAULTS, FC, Pkg, PropList, t } from './common';
import { fieldModuleVerify } from './field.Module.Verify';
import { fieldPeer } from './field.Peer';
import { useRedraw } from './use.Redraw';

export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.InfoField[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<InfoProps> = (props) => {
  const { fields = DEFAULTS.fields.default, data = {} } = props;

  useRedraw(data);

  const items = PropList.builder<t.InfoField>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => fieldModuleVerify(data))
    .field('Component', { label: 'Component', value: data.component?.name ?? '(Unnamed)' })
    .field('Peer', () => fieldPeer(data, fields))
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
  title(props: InfoProps) {
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
export const Info = FC.decorate<InfoProps, Fields>(View, { DEFAULTS }, { displayName: 'Info' });
