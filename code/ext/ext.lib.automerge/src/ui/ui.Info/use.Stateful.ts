import { useEffect, useState } from 'react';
import { DEFAULTS, PropList, R, type t } from './common';
import { useData } from './use.Data';

/**
 * Hook that when the property {stateful:true} manages
 * state internally to the component.
 */
export function useStateful(props: t.InfoProps) {
  const { stateful = DEFAULTS.stateful } = props;
  let data = useData(props.data);
  const rawFields = PropList.Wrangle.fields(props.fields);
  const rawVisible = data.visible?.value ?? true;

  const [fields, setFields] = useState(rawFields);
  const [isVisible, setVisible] = useState(rawVisible);

  useEffect(() => {
    if (!stateful) {
      if (!R.equals(rawFields, fields)) setFields(rawFields);
      if (!R.equals(rawVisible, isVisible)) setVisible(rawVisible);
    }
  }, [stateful, rawFields, rawVisible]);

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
          setFields(() => PropList.Wrangle.toggleField(fields, 'Doc.Object'));
          onIconClick?.(e);
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
        const filter = data.visible?.filter ?? DEFAULTS.visibleFilter;
        setFields(() => filter({ visible: e.next, fields: rawFields }));
        setVisible(e.next);
        onToggle?.(e);
      },
    };
    data = { ...data, visible };
  }

  /**
   * API
   */
  return { fields, data } as const;
}
