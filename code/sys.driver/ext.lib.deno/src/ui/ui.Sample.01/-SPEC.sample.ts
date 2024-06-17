export const code = `
Deno.serve((req) => new Response("👋 Hello!"));
`.substring(1);

export const SAMPLE = { code } as const;
