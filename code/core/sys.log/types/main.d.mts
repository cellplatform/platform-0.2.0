import { Logger } from './Log.mjs';
declare const Log: {
    black: import("./types.mjs").Logger;
    red: import("./types.mjs").Logger;
    green: import("./types.mjs").Logger;
    yellow: import("./types.mjs").Logger;
    blue: import("./types.mjs").Logger;
    magenta: import("./types.mjs").Logger;
    cyan: import("./types.mjs").Logger;
    white: import("./types.mjs").Logger;
    gray: import("./types.mjs").Logger;
    info: import("./types.mjs").LogMethod;
    warn: import("./types.mjs").LogMethod;
    error: import("./types.mjs").LogMethod;
};
export { Logger, Log, Log as log };
