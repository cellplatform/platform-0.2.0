export type TextDiff = {
  readonly index: number;
  readonly delCount: number;
  readonly newText?: string;
};
