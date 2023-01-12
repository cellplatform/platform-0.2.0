import { type t } from '../common';
import { MarkdownIs as Is } from './Markdown.Is.mjs';
import { MarkdownProcessor as processor } from '../Markdown.Processor';
import { MarkdownFind as Find } from './Markdown.Find.mjs';

export const Markdown: t.Markdown = {
  processor,
  Is,
  Find,
};
