/**
 * HTTP Response helpers.
 */
export const HttpResponse = {
  /**
   * Format an object into JSON.
   */
  json(status: number, data: any) {
    const json = JSON.stringify(data || null);
    return new Response(json, {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
