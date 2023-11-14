import { useEffect, useState } from 'react';

import { Info } from '../ui.Info';
import { type t } from './common';

export type SpecInfoProps = {
  model: t.RepoListModel;
  style?: t.CssValue;
};

export const SpecInfo: React.FC<SpecInfoProps> = (props) => {
  const { model } = props;
  const { store, index } = model;

  const [, setRedraw] = useState(0);
  const redraw = () => setRedraw((prev) => prev + 1);

  useEffect(() => {
    const events = index.doc.events();
    events.changed$.subscribe(() => redraw());
    return events.dispose;
  }, []);

  return (
    <Info
      style={props.style}
      fields={['Module', 'Repo', 'Component']}
      data={{
        repo: { store, index },
        component: { name: '<RepoList>' },
      }}
    />
  );
};
