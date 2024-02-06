import { useEffect, useRef, useState } from 'react';
import { View as CmdHost } from '../Dev.CmdHost/ui';
import { Filter, Time, rx, type t } from './common';
import { Url, Wrangle } from './u';

type T = t.Subject<t.SpecListScrollTarget>;

/**
 * A version of <CmdHost> that manages state interanally.
 */
export const CmdHostStateful: React.FC<t.CmdHostStatefulProps> = (props) => {
  const { mutateUrl = true } = props;

  const readyRef = useRef(false);
  const [command, setCommand] = useState(mutateUrl ? Wrangle.url().filter : '');
  const [isFocused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const specs = Filter.specs(props.specs, command, { maxErrors: 1 });
  const total = Object.keys(specs).length;
  const hintKeys = Wrangle.hintKey({ isFocused, selectedIndex, specs, command });

  const [childItems, setChildItems] = useState<t.SpecItemChildVisibility[]>([]);
  const selectionChangeTrigger = childItems.map((item) => item.isVisible).join(',');
  const scrollToRef$ = useRef<T>(new rx.Subject<t.SpecListScrollTarget>());

  /**
   * Handle scroll behavior when the selection changes.
   */
  useEffect(() => {
    const child = childItems[selectedIndex];
    const scrollTo$ = scrollToRef$.current;
    const index = child ? child.index : -1;
    if (child && !child.isVisible) scrollTo$.next({ index });
  }, [selectedIndex, selectionChangeTrigger]);

  /**
   * Reset the selection when the command/filter changes or on initial load.
   */
  useEffect(() => {
    const { selected } = Wrangle.url();
    let index = 0;
    if (selected && specs[selected]) index = Wrangle.selectedIndexFromNamespace(specs, selected);
    setSelectedIndex(index);
  }, [total, command]);

  /**
   * Keep command state in sync with passed-in property if it changes.
   */
  useEffect(() => {
    const ready = readyRef.current;
    const prop = props.command ?? '';
    if (ready && prop !== command) handleCommandChanged({ command: prop });
  }, [props.command]);

  /**
   * Set ready flag after initial render.
   */
  useEffect(() => {
    Time.delay(0, () => (readyRef.current = true));
  }, []);

  /**
   * Handlers
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
