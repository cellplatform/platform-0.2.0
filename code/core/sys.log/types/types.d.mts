export declare type Loggable = any;
export declare type Logger = (...items: Loggable[]) => string;
export declare type LogColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';
export declare type LogLevel = 'info' | 'warn' | 'error';
export declare type LogColors = {
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
export declare type LogMethod = LogColors & Logger;
export declare type Log = LogColors & {
    info: LogMethod;
    warn: LogMethod;
    error: LogMethod;
    group: LogMethod;
    groupEnd: () => void;
    clear: () => void;
};
