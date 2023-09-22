import { useBootstrap, useDocument } from '@automerge/automerge-repo-react-hooks';
import { Button, COLORS, Color, ObjectView, css, type t } from './common';

type Doc = { count: number };

export type AppProps = {
  style?: t.CssValue;
};

export const App: React.FC<AppProps> = (props) => {
  const { url } = useBootstrap({
    onNoDocument: (repo) => {
      const handle = repo.create<Doc>();
      handle.change((d: any) => (d.count = 0));
      return handle;
    },
  });
  const [doc, changeDoc] = useDocument<Doc>(url);

  console.log('-');
  console.log('App::useBootstrap.url:', url);
  console.log('App::useBootstrap.doc:', doc);

  if (!doc) return null;

  const increment = () => {
    /**
     * TODO 🐷
     * Figure out why this type isn't typed do <Doc>
     */
    changeDoc((d: any) => (d.count = (d.count || 0) + 1));
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ padding: 15 }),
    button: css({ color: COLORS.BLUE }),
    top: css({ display: 'grid', gridTemplateColumns: 'auto 1fr auto' }),
    bottom: css({
      marginTop: 10,
      paddingTop: 10,
      borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.top}>
        <div>{`🐷 count: ${doc?.count ?? 0}`}</div>
        <div />
        <Button onClick={increment}>
          <div {...styles.button}>increment</div>
        </Button>
      </div>
      <div {...styles.bottom}>
        <ObjectView data={doc} />
      </div>
    </div>
  );
};
