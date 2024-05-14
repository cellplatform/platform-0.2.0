import { PropList, type t } from './common';
import { Field } from './field';
import { useStateful } from './use.Stateful';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { theme } = props;
  const { fields, data } = useStateful(props);

  const items = PropList.builder<t.InfoField>()
    .field('Visible', () => Field.visible(data.visible, theme))
    .field('Module', () => Field.module())
    .field('Module.Verify', () => Field.moduleVerify(theme))
    .field('Repo', () => Field.repo(data.repo, theme))
    .field('Component', () => Field.component(data.component))
    .field('Doc', () => Field.document(data.document, fields, theme))
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
