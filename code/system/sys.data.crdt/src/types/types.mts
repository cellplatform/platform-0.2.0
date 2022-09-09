type O = Record<string, unknown>;
type SemVer = string;

export type CrdtInfo = {
  module: { name: string; version: SemVer };
  dataformat: { name: string; version: SemVer };
};

export type CrdtChangeHandler<T extends O> = (doc: T) => void;
