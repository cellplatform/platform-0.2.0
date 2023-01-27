// import { createWriteStream, ensureDir, writeFile } from 'fs-extra';
import { dirname } from 'path';
import { pipeline, Writable } from 'stream';
import { promisify } from 'util';

import { Json, t, fsextra } from '../common';

/**
 * References:
 *    https://iximiuz.com/en/posts/nodejs-writable-streams-distilled/
 */
const pipe = promisify(pipeline);

/**
 * Helpers for workint a streams.
 */
export const NodeStream: t.NodeStream = {
  /**
   * Determine if the given input is a readable stream.
   */
  isReadableStream(input?: any) {
    return typeof input?.on === 'function' && input?.readable === true;
  },

  /**
   * Encode an input string to a UTF-8 encoded [Uint8Array].
   */
  encode(input?: string) {
    return new TextEncoder().encode(input);
  },

  /**
   * Decode a [Uint8Array] to a UTF-8 string.
   */
  decode(input?: BufferSource, options?: TextDecodeOptions) {
    return new TextDecoder().decode(input, options);
  },

  /**
   * Read the given stream into an [Uint8Array].
   */
  async toUint8Array(input?: ReadableStream | t.Json | Uint8Array): Promise<Uint8Array> {
    if (input instanceof Uint8Array) return input;
    const isStream = NodeStream.isReadableStream(input);

    // Process JSON.
    if (!isStream) {
      const encode = NodeStream.encode;

      if (typeof input === 'string') return encode(input);
      if (typeof input === 'number') return encode(input.toString());
      if (typeof input === 'boolean') return encode(input.toString());
      if (input === undefined) return encode('undefined');
      if (input === null) return encode('null');

      return encode(Json.stringify(input as t.Json));
    }

    // Prepare a stream writer.
    const chunks: Uint8Array[] = [];
    const writer = new Writable({
      write(chunk, encoding, next) {
        chunks.push(Uint8Array.from(chunk));
        next();
      },
      final: (complete) => complete(),
    });

    // Process the stream.
    const data = input as any;
    await pipe(data, writer);

    // Assemble the final buffer.
    const totalLength = chunks.reduce((acc, next) => acc + next.length, 0);
    const res = new Uint8Array(totalLength);
    chunks.reduce((offset, next) => {
      res.set(next, offset);
      return offset + next.length;
    }, 0);

    // Finish up.
    return res;
  },

  /**
   * Save a readable stream to disk.
   */
  async save(path: string, data: ReadableStream | t.Json) {
    try {
      if (data === undefined) throw new Error(`No data`);
      await fsextra.ensureDir(dirname(path));

      // Stream
      if (NodeStream.isReadableStream(data)) {
        await pipe(data as any, fsextra.createWriteStream(path));
        return;
      }

      // JSON
      await fsextra.writeFile(path, Json.stringify(data as t.Json));
    } catch (err: any) {
      throw new Error(`Failed to save stream to '${path}'. ${err.message}`);
    }
  },
};
