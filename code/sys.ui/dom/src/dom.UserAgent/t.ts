export type UserAgentString = string;

/**
 * Ref:
 *    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 *
 *    Summary:
 *    "The User-Agent request header is a characteristic string that lets
 *     servers and network peers identify the application, operating system,
 *     vendor, and/or version of the requesting user agent."
 */
export type UserAgent = {
  readonly browser: UserAgentBrowser;
  readonly engine: UserAgentEngine;
  readonly os: UserAgentOS;
  readonly device: UserAgentDevice;
  readonly is: UserAgentFlags;
};

export type UserAgentOSKind = 'macOS' | 'iOS' | 'windows' | 'posix' | 'android' | 'UNKNOWN';
export type UserAgentFlag = keyof UserAgentFlags;
export type UserAgentFlags = {
  macOS: boolean;
  iOS: boolean;
  iPad: boolean;
  iPhone: boolean;
  posix: boolean;
  android: boolean;
  windows: boolean;
  mobile: boolean;
  tablet: boolean;
};

export type UserAgentBrowser = {
  readonly name: string;
  readonly version: string;
  readonly major: string;
};
export type UserAgentEngine = {
  readonly name: string;
  readonly version: string;
};
export type UserAgentOS = {
  readonly kind: UserAgentOSKind;
  readonly name: string;
  readonly version: string;
};

export type UserAgentDevice = {
  readonly vendor: string;
  readonly model: string;
  readonly type: string;
};
