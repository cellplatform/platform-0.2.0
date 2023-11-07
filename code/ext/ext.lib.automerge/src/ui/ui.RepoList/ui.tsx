import { LabelItem, RenderCount, css, type t, DEFAULTS } from './common';

type Props = t.RepoListProps & { list: t.RepoListState; renderers: t.RepoItemRenderers };

export const View: React.FC<Props> = (props) => {
  const { list } = props;
  const useBehaviors = Wrangle.useBehaviors(props);
  const { Provider, ref, handlers } = LabelItem.Stateful.useListController({ list, useBehaviors });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  const elements = LabelItem.Model.List.map(list, (item, i) => {
    return (
      <LabelItem.Stateful
        {...handlers}
        key={item.instance}
        index={i}
        list={list}
        item={item}
        renderers={props.renderers}
        useBehaviors={useBehaviors}
      />
    );
  });

  return (
    <Provider>
      <div ref={ref} {...css(styles.base, props.style)} tabIndex={0}>
        {props.renderCount && <RenderCount {...props.renderCount} />}
        <div>{elements}</div>
      </div>
    </Provider>
  );
};

/**
 * Helpers
 */
export const Wrangle = {
  useBehaviors(props: Props) {
    const { behavior: b = {} } = props;
    const res: t.LabelItemBehaviorKind[] = ['Item', 'List'];

    const d = DEFAULTS.behavior;
    if (b.focusOnLoad ?? d.focusOnLoad) res.push('Focus.OnLoad');
    if (b.focusOnArrowKey ?? d.focusOnArrowKey) res.push('Focus.OnArrowKey');

    return res;
  },
} as const;
