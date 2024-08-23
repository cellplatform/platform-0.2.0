import { DenoHttp, Doc, Wrangle, type t } from './common';

type O = Record<string, unknown>;

/**
 * Sample deployment to Deno sub-hosting.
 */
export async function sampleDeploy(main: t.Shell, doc: t.Doc) {
  const client = DenoHttp.client({});
  const projectId = 'sweet-gnu-41';

  const path = Wrangle.dataPath(doc.uri);
  const lens = Doc.lens<O, t.EditorContentYaml>(doc, path);
  const parsed = lens.current.parsed;
  if (parsed) {
    const json = JSON.stringify(parsed);
    const options = `{ headers: { "Content-Type": "application/json" }}`;
    const content = `Deno.serve((req) => new Response(\`${json}\`, ${options}));`;

    console.log('json', json);
    console.log('content', content);

    const res1 = await client.deploy(projectId, {
      entryPointUrl: 'main.ts',
      assets: { 'main.ts': { kind: 'file', content, encoding: 'utf-8' } },
      envVars: {},
    });

    console.log('deploy:res1', res1);

    const res2 = await res1.whenReady({ silent: false });
    console.log('deploy:res2', res2);

    if (res2.deployment && (res2.deployment.domains.length ?? 0) > 0) {
      const domain = res2.deployment.domains[0];
      const uri = Wrangle.docUri.fromId(doc.uri);

      const text = `${uri} https://${domain}`;
      main.cmdbar?.ctrl.update({ text });
    }
  }
}
