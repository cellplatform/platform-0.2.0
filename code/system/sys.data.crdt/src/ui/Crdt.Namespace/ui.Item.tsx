import { Item as BaseItem, Icons, css, type t } from './common';

export type ItemProps = {
  state: t.LabelActionController;
  style?: t.CssValue;
};

export const Item: React.FC<ItemProps> = (props) => {
  const { state } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
  };

  /**
   * TODO 🐷
   */
  const download: t.LabelAction = {
    kind: 'Pull:Namespace',
    icon: (e) => <Icons.Download.ArrowTray color={e.color} size={16} offset={[0, 2]} />,
    onClick(e) {
      // TODO 🐷
      console.log('💧', e.kind, '→ Item.onClick ⚡️⚡️⚡️');
    },
  };

  return (
    <BaseItem.Label
      {...state.props}
      {...state.handlers}
      label={state.data.label}
      placeholder={state.props.placeholder}
      enabled={state.props.enabled}
      //
      style={css(styles.base, props.style)}
      rightActions={[download]}
      focusOnEdit={true}
    />
  );
};
