export const HttpResponse = {
  json(status: number, data: any) {
    const json = JSON.stringify(data || null);
    return new Response(json, { status, headers: { 'Content-Type': 'application/json' } });
  },
} as const;
