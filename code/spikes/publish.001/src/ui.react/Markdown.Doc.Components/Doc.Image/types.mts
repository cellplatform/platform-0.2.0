export type DocImageAlign = 'Left' | 'Center' | 'Right';

export type DocImageDef = {
  align?: DocImageAlign;
  width?: number;
  border?: number;
  radius?: number;
  margin?: { top?: number; bottom?: number };
  offset?: { x?: number; y?: number };
  caption?: string;
};

export type DocImageCaption = {
  text: string;
  align?: DocImageAlign;
};
