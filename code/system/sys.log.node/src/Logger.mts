import { Logger as BaseLogger } from 'sys.log';
import { Table } from './Logger.Table.mjs';

export { Table };
export const Logger = {
  Table,
  create: () => ({ ...BaseLogger.create(), Table }),
};
