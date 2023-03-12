import { Dev, css, Processor, R } from '../../test.ui';
import { Icons } from '../Icons.mjs';
import { TileOutline } from '.';

type T = { count: number };
const initial: T = { count: 0 };

const markdown = `

# .0.
- #
  - Introduction          [ref](./0/introduction.md)    
  - Executive summary     [ref](./0/executive-summary.md)
  - Markdown (Ref)        [ref](./0/markdown.md)    

# .1. Web3 explainer                      [ref](./1/root.md)
- ##
  - A brief history of the web            [ref](./1/web-history.md)
  - Cryptographic trust on the internet   [ref](./1/cryptographic-trust.md)
  - Early landscape                       [ref](./1/early-landscape.md)
  

`;

export default Dev.describe('TileOutline', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    const md = await Processor.toMarkdown(markdown);

    ctx.subject.render(() => (
      <TileOutline
        markdown={markdown}
        widths={{ root: 250, child: 300 }}
        onClick={(e) => {
          console.log('⚡️ TileOutline.onClick:', e);
        }}
        renderTile={(e) => {
          const isRoot = R.equals(e.node, md.mdast.children[0]);
          if (!isRoot) return null;

          const styles = {
            base: css({
              Absolute: [null, 0, 25, 0],
              Flex: 'x-center-center',
            }),
          };
          return (
            <div {...styles.base}>
              <Icons.Book size={80} color={1} />
            </div>
          );
        }}
      />
    ));
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={3} />);

    dev.section('TileOutine');
  });
});
