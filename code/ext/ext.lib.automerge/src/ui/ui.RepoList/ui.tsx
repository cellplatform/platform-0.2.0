import { DEFAULTS, LabelItem, RenderCount, css, type t } from './common';
import { Wrangle } from './u.Wrangle';

type Props = t.RepoListProps & { list: t.RepoListState; renderers: t.RepoItemRenderers };

export const View: React.FC<Props> = (props) => {
  const { list, tabIndex = DEFAULTS.tabIndex } = props;
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
      <div ref={ref} {...css(styles.base, props.style)} tabIndex={tabIndex}>
        {props.renderCount && <RenderCount {...props.renderCount} />}
        <div>{elements}</div>
      </div>
    </Provider>
  );
};
