import { type t } from './common';
import { View } from './ui';
import { useLoader } from './use.Loader';

export const Stateful: React.FC<t.ModuleLoaderStatefulProps> = (props) => {
  const loader = useLoader(props);
  return (
    <View
      //
      {...props}
      front={loader.front}
      back={loader.back}
      spinning={loader.spinning}
    />
  );
};
