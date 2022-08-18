export type Is = IsFlags & IsMethods;

export type IsFlags = {
  nodeEnv: 'development' | 'production' | 'browser' | string;
  browser: boolean;
  dev: boolean;
  prod: boolean;
  test: boolean;
};

export type IsMethods = {
  toObject(): IsFlags;
  stream(input?: any): boolean;
  observable(input?: any): boolean;
  subject(input?: any): boolean;
  promise(input?: any): boolean;
  plainObject(input?: any): boolean;
  blank(input?: any): boolean;
  json(input?: any): boolean;
};
