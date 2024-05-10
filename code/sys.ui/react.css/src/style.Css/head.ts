import { t, Is } from '../common';

export const head: t.CssHead = {
  importStylesheet(url: string) {
    if (!Is.env.browser) return head;
    if (exists('style', url)) return head; // NB: Only add to the document once.

    const style = document.createElement('style');
    const css = `@import url('${url}')`;
    style.dataset.url = url;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Finish up.
    return head;
  },
};

/**
 * [Helpers]
 */
function exists(tag: 'style', url: string) {
  return Is.env.browser ? Boolean(findByUrl(tag, url)) : false;
}

function findByUrl(tag: 'style', url: string) {
  if (Is.env.browser) {
    const items = Array.from(document.getElementsByTagName(tag));
    return items.find((style) => style.dataset.url === url);
  } else {
    return undefined;
  }
}
