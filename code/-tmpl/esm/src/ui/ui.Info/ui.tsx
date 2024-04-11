import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';

export const View: React.FC<t.InfoProps> = (props) => {
  const { theme, data = {} } = props;
  const fields = PropList.Wrangle.fields(props.fields, DEFAULTS.fields.default);

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module(theme))
    .field('Module.Verify', () => Field.moduleVerify(theme))
    .field('Component', () => Field.component(data.component, theme))
    .items(fields);

  return (
    <PropList
      title={PropList.Info.Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      theme={theme}
      card={props.card}
      flipped={props.flipped}
      padding={props.card ? [20, 25, 30, 25] : undefined}
      margin={props.margin}
      style={props.style}
    />
  );
};
