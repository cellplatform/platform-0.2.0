import { useEffect, useState } from 'react';
import { DEFAULTS, PropList, R, rx, type t } from './common';
import { useData } from './use.Data';

/**
 * Hook that when {stateful:true} manages
 * state internally to the <Info> component.
 */
export function useStateful(props: t.InfoProps) {
  const { stateful = DEFAULTS.stateful } = props;
  let data = useData(props.data);
  const rawFields = PropList.Wrangle.fields(props.fields);
  const rawVisible = data.visible?.value ?? true;

  const [fields, setFields] = useState(rawFields);
  const [isVisible, setVisible] = useState(rawVisible);
  const [resetCount, setReset] = useState(0);
  const reset = () => setReset((n) => n + 1);

  const fire = (fields: t.InfoField[]) => {
    if (stateful) props.onStateChange?.({ fields, data });
  };

  /**
   * Lifecycle.
   */
  useEffect(() => {
    if (!stateful) reset();
  }, [stateful]);

  useEffect(() => {
    if (!R.equals(rawFields, fields)) setFields(rawFields);
    if (!R.equals(rawVisible, isVisible)) setVisible(rawVisible);
  }, [resetCount]);

  useEffect(() => {
    const life = rx.disposable();
    const $ = props.resetState$?.pipe(rx.takeUntil(life.dispose$), rx.debounceTime(10));
    $?.subscribe(reset);
    return life.dispose;
  }, [props.resetState$]);

  /**
   * Rebuild data object with stateful properties.
   */
  if (stateful && data.document) {
    const onIconClick = data.document.icon?.onClick;
    const document: t.InfoDataDocument = {
      ...data.document,
      icon: {
        ...data.document.icon,
        onClick(e) {
          const next = PropList.Wrangle.toggleField(fields, 'Doc.Object');
          setFields(next);
          fire(next);
          onIconClick?.(e); // Bubble to root handler.
        },
      },
    };
    data = { ...data, document };
  }

  if (stateful && data.visible) {
    const onToggle = data.visible?.onToggle;
    const visible: t.InfoData['visible'] = {
      ...data.visible,
      value: isVisible,
      onToggle(e) {
        const isVisible = e.next;
        setVisible(isVisible);
        fire(fields);
        onToggle?.(e); // Bubble to root handler.
      },
    };
    data = { ...data, visible };
  }

  /**
   * API
   */
  const api = {
    data,
    get fields() {
      if (stateful && data.visible?.value === false) {
        const filter = data.visible?.filter ?? DEFAULTS.visibleFilter;
        return filter({ visible: false, fields });
      } else {
        return fields;
      }
    },
  } as const;
  return api;
}
