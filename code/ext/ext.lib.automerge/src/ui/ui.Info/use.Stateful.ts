import { useState } from 'react';
import { DEFAULTS, PropList, type t } from './common';
import { useData } from './use.Data';

/**
 * Handles state.
 */
export function useStateful(
  isStateful: boolean = true,
  fieldsInput: (t.InfoField | undefined)[] = DEFAULTS.fields.default,
  dataInput?: t.InfoData,
) {
  const rawFields = PropList.Wrangle.fields(fieldsInput);
  let data = useData(dataInput);

  const [fields, setFields] = useState(rawFields);
  const [isVisible, setVisible] = useState(data.visible?.value ?? true);

  /**
   * Rebuild data object with stateful properties.
   */
  if (isStateful) {
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

  return { fields, data } as const;
}
