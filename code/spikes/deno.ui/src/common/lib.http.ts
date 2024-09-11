import { serveDir as dir, serveFile as file } from 'jsr:@std/http@1.0.5';

/**
 * HTTP Server
 */
export const Http = {
  Serve: { file, dir },
} as const;
