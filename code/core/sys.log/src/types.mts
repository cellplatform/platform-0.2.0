export type Loggable = any;
export type Logger = (...items: Loggable[]) => string;

export type LogColor =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray';

export type LogLevel = 'info' | 'warn' | 'error';

export type LogColors = {
  black: Logger;
  red: Logger;
  green: Logger;
  yellow: Logger;
  blue: Logger;
  magenta: Logger;
  cyan: Logger;
  white: Logger;
  gray: Logger;
};

export type LogMethod = LogColors & Logger;

export type Log = LogColors & {
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  group: LogMethod;
  groupEnd: () => void;
  clear: () => void;
};
