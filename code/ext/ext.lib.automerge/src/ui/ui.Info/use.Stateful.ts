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
  if (isStateful && data.document) {
    const onIconClick = data.document.onIconClick;
    const document: t.InfoDataDocument = {
      ...data.document,
      onIconClick(e) {
        setFields(() => PropList.Wrangle.toggleField(fields, 'Doc.Object'));
        onIconClick?.(e);
      },
    };
    data = { ...data, document };
  }

  if (isStateful && data.visible) {
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
