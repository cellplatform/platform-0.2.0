export async function render() {
  const { Concept } = await import('sys.ui.react.concept');
  const { DATA } = await import('./-sample.data.mjs');
  return <Concept.Layout.Stateful slugs={DATA.slugs} />;
}
