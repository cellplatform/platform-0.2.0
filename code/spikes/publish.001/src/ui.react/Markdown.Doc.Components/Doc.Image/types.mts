export type DocImageAlign = 'Left' | 'Center' | 'Right';

export type DocImageDef = {
  align?: DocImageAlign;
  width?: number;
  border?: number;
  margin?: { top?: number; bottom?: number };
  title?: string;
};

export type DocImageTitle = {
  text: string;
  align?: DocImageAlign;
};
