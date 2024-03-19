import { DEFAULTS, PropList, type t } from './common';
import { InfoField } from './field';
import { useRedrawOnChange } from './use.RedrawOnChange';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { data = {}, theme } = props;
  const fields = PropList.Wrangle.fields(props.fields, DEFAULTS.fields.default);

  useRedrawOnChange(data);

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => InfoField.module())
    .field('Module.Verify', () => InfoField.moduleVerify(theme))
    .field('Repo', () => InfoField.repo(data.repo, theme))
    .field('Component', () => InfoField.component(data.component))
    .field('Doc', () => InfoField.doc(data.document, fields, theme))
    .field('History', () => InfoField.history(data.history, fields, theme))
    .items(fields);

  return (
    <PropList
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      theme={props.theme}
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
