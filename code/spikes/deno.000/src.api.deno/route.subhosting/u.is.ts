export const Is = {
  statusOK(input: number | Response) {
    const status = typeof input === 'number' ? input : input.status;
    return (status || 0).toString().startsWith('2');
  },
} as const;
