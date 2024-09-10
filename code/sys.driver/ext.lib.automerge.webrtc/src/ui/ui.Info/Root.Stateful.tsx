import { type t } from './common';
import { View } from './ui';
import { useStateful } from './use.Stateful';

export const Stateful: React.FC<t.InfoStatefulProps> = (props) => {
  const state = useStateful(props);
  return (
    <View
      //
      {...state.props.view}
      {...state.handlers}
      internal={state.props.stateful}
    />
  );
};
