export type InfoDataVisible<InfoField extends string = any> = {
  value?: boolean;
  enabled?: boolean;
  label?: string;
  filter?: (e: { visible: boolean; fields: InfoField[] }) => InfoField[];
  onToggle?: InfoDataVisibleToggle;
};

/**
 * Events
 */
export type InfoDataVisibleToggle = (e: InfoDataVisibleToggleArgs) => void;
export type InfoDataVisibleToggleArgs = { prev: boolean; next: boolean };
