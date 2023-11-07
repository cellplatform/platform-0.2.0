import { css, type t } from './common';
import { List } from './ui.List';

type Props = t.RepoListProps & {
  list: t.RepoListState;
  renderers: t.RepoItemRenderers;
};

export const View: React.FC<Props> = (props) => {
  const { list, renderers } = props;

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return <List list={list} renderers={renderers} renderCount={props.renderCount} />;
};
