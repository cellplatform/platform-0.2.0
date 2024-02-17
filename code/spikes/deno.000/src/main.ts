import { App, Routes } from './app.ts';

const app = App.init();
Routes.root('/', app);
Routes.ai('/ai', app);
Routes.deno.subhosting('deno/subhosting', app);

Deno.serve({ port: 8080 }, app.fetch);
