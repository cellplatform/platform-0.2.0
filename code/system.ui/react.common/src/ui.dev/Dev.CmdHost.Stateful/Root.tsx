import { useEffect, useRef, useState } from 'react';
import { View as CmdHost } from '../Dev.CmdHost/ui';
import { Filter, rx, type t } from './common';
import { Url, Wrangle } from './u';

type T = t.Subject<t.SpecListScrollTarget>;

/**
 * A version of <CmdHost> that manages state interanally.
 */
export const CmdHostStateful: React.FC<t.CmdHostStatefulProps> = (props) => {
  const { mutateUrl = true } = props;

  const [command, setCommand] = useState(Wrangle.url().filter);
  const [isFocused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const specs = Filter.specs(props.specs, command, { maxErrors: 1 });
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
      specs={specs}
      command={command}
      applyFilter={false} // NB: Filter already applied above.
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
