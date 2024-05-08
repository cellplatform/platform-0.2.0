import { useEffect, useRef, useState } from 'react';
import { View as CmdHost } from '../Dev.CmdHost/ui';
import { Time, rx, type t } from './common';
import { Url, Wrangle } from './u';

type T = t.Subject<t.ModuleListScrollTarget>;

/**
 * A version of <CmdHost> that manages state interanally.
 */
export const View: React.FC<t.CmdHostStatefulProps> = (props) => {
  const { mutateUrl = true, enabled = true } = props;

  const readyRef = useRef(false);
  const [command, setCommand] = useState(mutateUrl ? Wrangle.url().filter : '');
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<string>();

  const imports = Wrangle.filteredImports({ ...props, command });
  const total = Object.keys(imports).length;
  const hintKeys = Wrangle.hintKey({ focused, command });
  const selectedIndex = Wrangle.selectedIndexFromUri(imports, selected);

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
   * Keep state in sync with passed-in properties when they change.
   */
  useEffect(() => {
    const ready = readyRef.current;
    const prop = props.selected;
    if (ready && prop !== selected) setSelected(prop);
  }, [props.selected]);

  /**
   * Key comand in sync with passed-in properties when they change.
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

  const handleItemSelected: t.ModuleListItemHandler = (e) => {
    setSelected(e.index > -1 ? e.uri : undefined);
    props.onItemSelect?.(e);
  };

  const handleKeyboard = (e: t.TextInputKeyArgs) => {
    if (!enabled) return;
    const done = () => e.preventDefault();
    const index = Wrangle.selectedIndexFromUri(imports, selected);

    if (e.key === 'Home' || (e.key === 'ArrowUp' && e.metaKey)) {
      setSelected(Wrangle.selectedUriFromIndex(imports, 0));
      return done();
    }
    if (e.key === 'End' || (e.key === 'ArrowDown' && e.metaKey)) {
      setSelected(Wrangle.selectedUriFromIndex(imports, total - 1));
      return done();
    }
    if (e.key === 'ArrowUp') {
      const next = Math.max(0, index - (e.altKey ? 5 : 1));
      setSelected(Wrangle.selectedUriFromIndex(imports, next));
      return done();
    }
    if (e.key === 'ArrowDown') {
      const next = Math.min(total - 1, index + (e.altKey ? 5 : 1));
      setSelected(Wrangle.selectedUriFromIndex(imports, next));
      return done();
    }
    if (e.key === 'Enter') {
      if (mutateUrl) {
        Url.mutateLoadedNamespace(index, imports, { reload: true });
        done();
      }
      if (props.onItemClick && selected) {
        const uri = Wrangle.selectedUriFromIndex(imports, index);
        props.onItemClick({ index, uri });
        done();
      }
    }

    props.onKeyDown?.(e);
  };

  /**
   * [Render]
   */
  return (
    <CmdHost
      {...props}
      imports={imports}
      command={command}
      filter={null} // NB: Filter already applied above.
      selected={selected}
      enabled={enabled}
      focused={focused}
      hintKey={hintKeys}
      scrollTo$={scrollToRef$.current}
      onChanged={handleCommandChanged}
      onCmdFocusChange={(e) => setFocused(e.is.focused)}
      onKeyDown={handleKeyboard}
      onItemVisibility={(e) => setItems(e.children)}
      onItemSelect={handleItemSelected}
    />
  );
};
