import type { t } from '../common';
import { MarkdownIs as Is } from './Markdown.Is';
import { MarkdownProcessor as processor } from '../Markdown.Processor';
import { MarkdownFind as Find } from './Markdown.Find';

export const Markdown: t.Markdown = {
  processor,
  Find,
  Is,
} as const;
