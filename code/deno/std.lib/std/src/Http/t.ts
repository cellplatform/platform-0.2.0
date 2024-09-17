export type HttpUrl = {
  readonly base: string;
  join(...parts: string[]): string;
  toString(): string;
};
