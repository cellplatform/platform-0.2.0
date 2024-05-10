import { Markdown } from 'sys.data.text';

const md = `# Hello`;
const html = await Markdown.toHtml(md);

console.log('html', html);
