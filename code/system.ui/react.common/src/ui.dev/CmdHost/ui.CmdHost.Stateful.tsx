import { useState } from 'react';
import { CmdHost, CmdHostProps } from './ui.CmdHost';
import { R, DEFAULTS, t } from './common';

export type CmdHostStatefulProps = Omit<CmdHostProps, 'filter'> & {
  mutateUrl?: boolean;
};

/**
 * A version of <CmdHost> that manages state interanally.
 */
export const CmdHostStateful: React.FC<CmdHostStatefulProps> = (props) => {
  const { mutateUrl = true, specs } = props;
  const total = specs ? Object.keys(specs).length : -1;

  const [filter, setFilter] = useState(Wrangle.url().filter);
  const [isFocused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hintKeys = Wrangle.hintKey({ isFocused, selectedIndex, specs });

  /**
   * [Handlers]
   */
  const handleFilterChanged = (e: { filter: string }) => {
    if (mutateUrl) Wrangle.mutateUrl(e.filter);
    setFilter(e.filter);
    props.onChanged?.(e);
  };

  /**
   * [Render]
   */
  return (
    <CmdHost
      {...props}
      filter={filter}
      selectedIndex={isFocused ? selectedIndex : undefined}
      onChanged={handleFilterChanged}
      hintKey={hintKeys}
      onCmdFocusChange={(e) => setFocused(e.isFocused)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') setSelectedIndex(Wrangle.selected(specs, selectedIndex - 1));
        if (e.key === 'ArrowDown') setSelectedIndex(Wrangle.selected(specs, selectedIndex + 1));
        if (e.key === 'Home') setSelectedIndex(Wrangle.selected(specs, 0));
        if (e.key === 'End') setSelectedIndex(Wrangle.selected(specs, total - 1));
      }}
    />
  );
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

  selected(specs: t.SpecImports | undefined, next: number) {
    if (!specs) return -1;
    const total = Object.keys(specs).length;
    return R.clamp(0, total - 1, next);
  },

  hintKey(args: { isFocused: boolean; specs?: t.SpecImports; selectedIndex: number }) {
    if (!args.isFocused) return '⌘K';
    return ['↑', '↓', 'enter'];
  },
};
