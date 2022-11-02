import { t } from '../common.mjs';
import { MarkdownIs as Is } from './Markdown.Is.mjs';
import { MarkdownProcessor as processor } from '../Markdown.Processor/index.mjs';
import { MarkdownFind as Find } from './Markdown.Find.mjs';

export const Markdown: t.Markdown = {
  processor,
  Is,
  Find,
};
