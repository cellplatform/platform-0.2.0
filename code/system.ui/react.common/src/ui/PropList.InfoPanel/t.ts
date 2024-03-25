export type InfoDataVisible = {
  value?: boolean;
  enabled?: boolean;
  label?: string;
  onToggle?: InfoDataVisibleToggle;
};

/**
 * Events
 */
export type InfoDataVisibleToggle = (e: InfoDataVisibleToggleArgs) => void;
export type InfoDataVisibleToggleArgs = { prev: boolean; next: boolean };
