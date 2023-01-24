export type Is = IsFlags & IsMethods;

export type IsFlags = {
  env: {
    browser: boolean;
    nodejs: boolean;
  };
};

export type IsMethods = {
  stream(input?: any): boolean;
  observable(input?: any): boolean;
  subject(input?: any): boolean;
  promise(input?: any): boolean;
  plainObject(input?: any): boolean;
  blank(input?: any): boolean;
  numeric(input?: any): boolean;
  json(input?: any): boolean;
  email(input?: any): boolean;
  url(input?: any): boolean;
};
