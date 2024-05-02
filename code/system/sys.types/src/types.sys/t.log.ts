type L = LogLevel | LogLevel[] | undefined;

export type LogLevelInput = L | (() => L);
export type LogLevel = 'Debug' | 'Info' | 'Warn' | 'Error';
