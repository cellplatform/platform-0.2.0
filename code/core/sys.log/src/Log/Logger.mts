import { t, pc } from '../common';

const colors: t.LogColor[] = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
];

export const Logger = {
  colors,

  /**
   * Instantiate a new log instance.
   */
  create(): t.Log {
    const write = (level: t.LogLevel, items: any[]) => {
      console[level].apply(console, items);
      return items.join(' ');
    };

    const group: t.Logger = (...items) => {
      console.group(...items);
      return items.join(' ');
    };
    const groupEnd = () => console.groupEnd();

    const colorizer = (color: t.LogColor): t.Logger => {
      return (...items) => {
        items = colorize(color, items);
        return items.join(' ');
      };
    };

    const logger = (level: t.LogLevel, color?: t.LogColor): t.Logger => {
      return (...items) => {
        if (color) {
          items = colorize(color, items);
        } else {
          if (level === 'warn') items = colorize('yellow', items);
          if (level === 'error') items = colorize('red', items);
        }
        return write(level, items);
      };
    };

    const levelMethod = (level: t.LogLevel): t.LogMethod => {
      const fn = logger(level);
      colors.forEach((color) => ((fn as any)[color] = logger(level, color)));
      return fn as t.LogMethod;
    };

    const colorMethods = colors.reduce((acc, next) => {
      acc[next] = colorizer(next);
      return acc;
    }, {} as t.LogColors);

    return {
      info: levelMethod('info'),
      warn: levelMethod('warn'),
      error: levelMethod('error'),
      ...colorMethods,
      group,
      groupEnd,
    };
  },
};

/**
 * Helpers
 */

function isSimpleValue(item: any) {
  return typeof item === 'string' || typeof item == 'number' || typeof item === 'boolean';
}

function colorize(color: t.LogColor, items: any[]) {
  return items.map((item) => (isSimpleValue(item) ? pc[color](item) : item));
}
