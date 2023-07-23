import { useState } from 'react';
import { type t } from '../common';

import { View } from './ui';

export const Stateful: React.FC<t.RootStatefulProps> = (props) => {
  const { slugs = [] } = props;
  const [selected, setSelected] = useState(0);
  return (
    <View
      slugs={slugs}
      selected={selected}
      onSelect={(e) => {
        setSelected(e.index);
      }}
    />
  );
};
