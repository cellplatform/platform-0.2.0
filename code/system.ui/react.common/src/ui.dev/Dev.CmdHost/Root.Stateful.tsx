import { DEFAULTS, R, SpecList, rx, t } from './common';

import { useEffect, useRef, useState } from 'react';
import { CmdHost, type CmdHostProps } from './Root';

export type CmdHostStatefulProps = Omit<CmdHostProps, 'filter'> & {
  mutateUrl?: boolean;
};

type T = t.Subject<t.SpecListScrollTarget>;

/**
 * A version of <CmdHost> that manages state interanally.
 */
export const CmdHostStateful: React.FC<CmdHostStatefulProps> = (props) => {
  const { mutateUrl = true } = props;

  const [command, setCommand] = useState(Wrangle.url().filter);
  const [isFocused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const specs = SpecList.Filter.specs(props.specs, command, { maxErrors: 1 });
  const total = Object.keys(specs).length;
  const hintKeys = Wrangle.hintKey({ isFocused, selectedIndex, specs, command });

  const [childItems, setChildItems] = useState<t.SpecListChildVisibility[]>([]);
  const selectionChangeTrigger = childItems.map((item) => item.isVisible).join(',');
  const scrollToRef$ = useRef<T>(new rx.Subject<t.SpecListScrollTarget>());

  /**
   * [Effects]
   */
  useEffect(() => {
    /**
     * Handle scroll behavior when the selection changes.
     */
    const child = childItems[selectedIndex];
    const scrollTo$ = scrollToRef$.current;
    const index = child ? child.index : -1;
    if (child && !child.isVisible) scrollTo$.next({ index });
  }, [selectedIndex, selectionChangeTrigger]);

  useEffect(() => {
    /**
     * Reset the selection when the command/filter changes or on initial load.
     */
    const { selected } = Wrangle.url();
    let index = 0;
    if (selected && specs[selected]) index = Wrangle.selectedIndexFromNamespace(specs, selected);
    setSelectedIndex(index);
  }, [total, command]);

  /**
   * [Handlers]
   */
  const handleCommandChanged: t.CmdHostChangedHandler = (e) => {
    if (mutateUrl) Url.mutateFilter(e.command);
    setCommand(e.command);
    props.onChanged?.(e);
  };

  const handleKeyboard = (e: t.TextInputKeyEvent) => {
    const done = () => e.preventDefault();

    if (e.key === 'Home' || (e.key === 'ArrowUp' && e.metaKey)) {
      setSelectedIndex(Wrangle.selected(specs, 0));
      return done();
    }
    if (e.key === 'End' || (e.key === 'ArrowDown' && e.metaKey)) {
      setSelectedIndex(Wrangle.selected(specs, total - 1));
      return done();
    }

    if (e.key === 'ArrowUp') {
      const next = selectedIndex - (e.altKey ? 5 : 1);
      setSelectedIndex(Wrangle.selected(specs, next));
      return done();
    }
    if (e.key === 'ArrowDown') {
      const next = selectedIndex + (e.altKey ? 5 : 1);
      setSelectedIndex(Wrangle.selected(specs, next));
      return done();
    }
    if (e.key === 'Enter' && mutateUrl) {
      Url.mutateLoadedNamespace(selectedIndex, specs, { reload: true });

      /**
       * NB: forced page reload here
       * 🐷 Integration Extension (HERE)
       *    - load inline as child <Component>.
       *    - load transitions (spinner, fade-in, etc).
       */
      return done();
    }
  };

  /**
   * [Render]
   */
  return (
    <CmdHost
      {...props}
      command={command}
      selectedIndex={isFocused ? selectedIndex : undefined}
      hintKey={hintKeys}
      scrollTo$={scrollToRef$.current}
      onChanged={handleCommandChanged}
      onCmdFocusChange={(e) => setFocused(e.isFocused)}
      onKeyDown={handleKeyboard}
      onChildVisibility={(e) => setChildItems(e.children)}
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
    const filter = params.get(DEFAULTS.qs.filter) ?? '';
    const selected = params.get(DEFAULTS.qs.selected) ?? '';
    return { url, params, filter, selected };
  },

  selected(specs: t.SpecImports | undefined, next: number) {
    if (!specs) return -1;
    const total = Object.keys(specs).length - 1;
    return total >= 0 ? R.clamp(0, total, next) : -1;
  },

  selectedIndexFromNamespace(specs: t.SpecImports | undefined, namespace: string) {
    if (!specs || !namespace || namespace === 'true') return -1;
    const index = Object.keys(specs).indexOf(namespace);
    return Wrangle.selected(specs, index);
  },

  selectedNamespaceFromIndex(specs: t.SpecImports | undefined, index: number) {
    return Object.keys(specs ?? {})[index];
  },

  hintKey(args: {
    isFocused: boolean;
    specs?: t.SpecImports;
    selectedIndex: number;
    command: string;
  }) {
    if (!args.isFocused) return ['↑', '↓', '⎇K'];
    return ['↑', '↓', 'enter'];
  },
};

const Url = {
  push(url: URL, options: { reload?: boolean } = {}) {
    const path = url.href;
    window.history.pushState({ path }, '', url.href);
    if (options.reload) window.location.reload();
  },

  mutateFilter(filter: string, options: { reload?: boolean } = {}) {
    const { url, params } = Wrangle.url();
    if (filter) params.set(DEFAULTS.qs.filter, filter);
    if (!filter) params.delete(DEFAULTS.qs.filter);
    Url.push(url, options);
  },

  mutateLoadedNamespace(
    index: number,
    specs: t.SpecImports | undefined,
    options: { reload?: boolean } = {},
  ) {
    if (!specs) return;
    if (index < 0) return;

    const { url, params } = Wrangle.url();
    const namespace = Wrangle.selectedNamespaceFromIndex(specs, index);
    if (!namespace) return;

    params.set(DEFAULTS.qs.dev, namespace);
    params.delete(DEFAULTS.qs.selected);
    Url.push(url, options);
  },
};
