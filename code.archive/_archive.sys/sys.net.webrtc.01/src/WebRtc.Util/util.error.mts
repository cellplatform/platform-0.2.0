import { t } from './common';

export const error = {
  toType(err: Error) {
    const type = ((err as any).type ?? 'unknown') as t.PeerErrorType;
    return type;
  },

  isFatal(type: t.PeerErrorType) {
    const FATAL: t.PeerErrorType[] = [
      'browser-incompatible',
      'invalid-id',
      'invalid-key',
      'ssl-unavailable',
      'server-error',
      'socket-error',
      'socket-closed',
      'unavailable-id',
    ];
    return FATAL.includes(type);
  },

  toPeerError(err: Error): t.PeerError {
    const type = error.toType(err);
    const isFatal = error.isFatal(type);
    const message = err.message;
    return { type, isFatal, message };
  },
};
