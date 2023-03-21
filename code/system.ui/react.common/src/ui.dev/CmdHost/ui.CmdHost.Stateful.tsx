import { useState } from 'react';
import { CmdHost, CmdHostProps } from './ui.CmdHost';
import { R, DEFAULTS, t, SpecList } from './common';

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
  const filteredSpecs = SpecList.Filter.specs(specs, filter);

  /**
   * [Handlers]
   */
  const handleFilterChanged: t.CmdHostChangedHandler = (e) => {
    if (mutateUrl) Url.mutateFilter(e.command);
    setFilter(e.command);
    props.onChanged?.(e);
  };

  const handleKeyboard = (key: string, cancel: () => void) => {
    if (key === 'ArrowUp') {
      setSelectedIndex(Wrangle.selected(filteredSpecs, selectedIndex - 1));
      cancel();
    }
    if (key === 'ArrowDown') {
      setSelectedIndex(Wrangle.selected(filteredSpecs, selectedIndex + 1));
      cancel();
    }
    if (key === 'Home') {
      setSelectedIndex(Wrangle.selected(filteredSpecs, 0));
    }
    if (key === 'End') {
      setSelectedIndex(Wrangle.selected(filteredSpecs, total - 1));
    }
    if (key === 'Enter') {
      if (mutateUrl) {
        Url.mutateSelected(selectedIndex, filteredSpecs);
        window.location.reload();
      }
    }
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
      onKeyDown={(e) => handleKeyboard(e.key, e.preventDefault)}
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

const Url = {
  mutateFilter(filter: string) {
    const { url, params } = Wrangle.url();
    if (filter) params.set(DEFAULTS.QS.filter, filter);
    if (!filter) params.delete(DEFAULTS.QS.filter);
    const path = url.href;
    window.history.pushState({ path }, '', path);
  },

  mutateSelected(selectedIndex: number, specs?: t.SpecImports) {
    if (!specs) return;
    if (selectedIndex < 0) return;

    const { url, params } = Wrangle.url();
    const ns = Object.keys(specs)[selectedIndex];
    if (!ns) return;

    params.set(DEFAULTS.QS.dev, ns);
    const path = url.href;
    window.history.pushState({ path }, '', path);
  },
};
