import { useState, useEffect } from 'react';
import { CmdHost, CmdHostProps } from './ui.CmdHost';
import { DEFAULTS } from './common';

export type CmdHostStatefulProps = Omit<CmdHostProps, 'filter'> & {
  mutateUrl?: boolean;
};

/**
 * A version of <CmdHost> that manages state interanally.
 */
export const CmdHostStateful: React.FC<CmdHostStatefulProps> = (props) => {
  const { mutateUrl = true } = props;
  const [filter, setFilter] = useState(Wrangle.url().filter);

  /**
   * [Handlers]
   */
  const handleFilterChanged = (e: { filter: string }) => {
    if (mutateUrl) Wrangle.mutateUrl(e.filter);
    setFilter(e.filter);
    props.onFilterChanged?.(e);
  };

  /**
   * [Render]
   */
  return <CmdHost {...props} filter={filter} onFilterChanged={handleFilterChanged} />;
};

/**
 * [Helpers]
 */
const Wrangle = {
  url() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const filter = params.get(DEFAULTS.QS.filter) ?? '';
    return { url, params, filter };
  },

  mutateUrl(filter: string) {
    const { url, params } = Wrangle.url();
    if (filter) params.set(DEFAULTS.QS.filter, filter);
    if (!filter) params.delete(DEFAULTS.QS.filter);
    const path = url.href;
    window.history.pushState({ path }, '', path);
  },
};
