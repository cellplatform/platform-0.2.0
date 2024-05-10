import { Markdown } from 'sys.text';

const md = `# Hello`;
const html = await Markdown.toHtml(md);

console.log('html', html);
