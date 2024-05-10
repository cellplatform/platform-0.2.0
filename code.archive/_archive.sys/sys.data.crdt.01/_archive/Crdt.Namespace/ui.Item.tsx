import { Icons, LabelItem, css, type t } from './common';

export type ItemProps = {
  state: t.LabelItemController<string>;
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
    // element: (e) => <Icons.Download.ArrowTray color={e.color} size={16} offset={[0, 2]} />,
    // onClick(e) {
    //   /**
    //    * TODO 🐷
    //    */
    //   console.log('💧', e.kind, '→ Item.onClick ⚡️⚡️⚡️');
    // },
  };

  return (
    <LabelItem
      {...state.handlers}
      // label={state.data.label}
      style={css(styles.base, props.style)}
      // right={[download]}
      focusOnEdit={true}
    />
  );
};
