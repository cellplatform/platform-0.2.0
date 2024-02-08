import { useEffect, useRef, useState } from 'react';
import { View as CmdHost } from '../Dev.CmdHost/ui';
import { Filter, Time, rx, type t } from './common';
import { Url, Wrangle } from './u';

type T = t.Subject<t.ModuleListScrollTarget>;

/**
 * A version of <CmdHost> that manages state interanally.
 */
export const CmdHostStateful: React.FC<t.CmdHostStatefulProps> = (props) => {
  const { mutateUrl = true } = props;

  const readyRef = useRef(false);
  const [command, setCommand] = useState(mutateUrl ? Wrangle.url().filter : '');
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex ?? 0);
  const [selectedItem, setSelectedItem] = useState<t.ModuleListItemHandlerArgs>();

  const specs = Filter.specs(props.specs, command, { maxErrors: 1 });
  const total = Object.keys(specs).length;
  const hintKeys = Wrangle.hintKey({ focused, selectedIndex, specs, command });

  const [items, setItems] = useState<t.ModuleListItemVisibility[]>([]);
  const selectionChangeTrigger = items.map((item) => item.isVisible).join(',');
  const scrollToRef$ = useRef<T>(new rx.Subject<t.ModuleListScrollTarget>());

  /**
   * Handle scroll behavior when the selection changes.
   */
  useEffect(() => {
    const child = items[selectedIndex];
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
   * Keep state in sync with passed-in properties when they change.
   */
  useEffect(() => {
    const ready = readyRef.current;
    const prop = props.selectedIndex ?? 0;
    if (ready && prop !== selectedIndex) setSelectedIndex(prop);
  }, [props.selectedIndex]);

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

  const handleItemSelected: t.ModuleListItemHandler = (e) => {
    setSelectedItem(e.index > -1 ? e : undefined);
    props.onItemSelect?.(e);
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
    if (e.key === 'Enter') {
      if (mutateUrl) {
        Url.mutateLoadedNamespace(selectedIndex, specs, { reload: true });
        done();
      }

      if (props.onItemClick && selectedItem) {
        props.onItemClick(selectedItem);
        done();
      }
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
      selectedIndex={selectedIndex}
      focused={focused}
      hintKey={hintKeys}
      scrollTo$={scrollToRef$.current}
      onChanged={handleCommandChanged}
      onCmdFocusChange={(e) => setFocused(e.isFocused)}
      onKeyDown={handleKeyboard}
      onItemVisibility={(e) => setItems(e.children)}
      onItemSelect={handleItemSelected}
    />
  );
};
