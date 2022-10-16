import type { Code as MdCodeNode } from 'mdast';
import type { Element as HtmlElementNode } from 'hast';

export type CodeBlock = {
  id: string;
  lang: string;
  type: string;
  text: string;
};

export type CodeMatch = (e: CodeMatchArgs) => void;
export type CodeMatchArgs = {
  node: MdCodeNode;
  replace(node: HtmlElementNode): void;
};
