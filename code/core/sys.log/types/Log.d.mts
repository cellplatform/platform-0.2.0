import { t } from './common';
export declare const Logger: {
    colors: t.LogColor[];
    /**
     * Instantiate a new log instance.
     */
    create(): {
        black: t.Logger;
        red: t.Logger;
        green: t.Logger;
        yellow: t.Logger;
        blue: t.Logger;
        magenta: t.Logger;
        cyan: t.Logger;
        white: t.Logger;
        gray: t.Logger;
        info: t.LogMethod;
        warn: t.LogMethod;
        error: t.LogMethod;
    };
};
