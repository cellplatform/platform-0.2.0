import type { t } from '../common';

export type MarkdownPropsBase = { version: string };
type B = MarkdownPropsBase;

/**
 * TODO 🐷
 * - move to sys.types.
 */
export type FilePathParts = {
  dir: string;
  filename: string;
  name: string;
  ext: string;
  path: string;
};

/**
 * File Structure
 */
export type MarkdownFile<P extends B = B> = {
  file: FilePathParts;
  props: P;
  error?: string;
  content: { html: string; markdown: string };
  write(target: t.Fs, options?: { dir?: string; html?: boolean; md?: boolean }): Promise<void>;
};

/**
 * File Factory.
 */
export type MarkdownFileFactory<T extends B = B> = () => Promise<MarkdownFile<T>>;
export type MarkdownFileFactoryArgs = {
  Text: t.Text;
  src: t.Fs;
  path: string;
  propsType?: string;
  throwError?: boolean;
};
