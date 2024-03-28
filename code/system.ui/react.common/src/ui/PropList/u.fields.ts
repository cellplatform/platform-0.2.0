export function fields<T extends string>(
  input: (T | undefined | null)[] | undefined,
  defaults?: T[],
): T[] {
  return (input ?? defaults ?? []).filter(Boolean) as T[];
}

export function toggleField<T extends string>(
  currentFields: (T | undefined | null)[] = [],
  toggleField: T,
): T[] {
  const list = fields(currentFields);
  return list.includes(toggleField)
    ? list.filter((f) => f !== toggleField)
    : [...list, toggleField];
}
