type PathString = string;

export type DocOverlayDef = {
  source: PathString;
  detail?: string;
  margin?: { top?: number; bottom?: number };
};
