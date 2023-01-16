export function shouldShowHr(depth: number, prev: string, next: string): boolean {
  if (typeof depth !== 'number') return false;
  if (typeof prev !== 'string' || typeof next !== 'string') return false;

  if (depth > 1) {
    const parts = {
      prev: prev.split('.').slice(0, depth).join('.'),
      next: next.split('.').slice(0, depth).join('.'),
    };

    if (parts.prev !== parts.next) return true;
  }
  return false;
}
