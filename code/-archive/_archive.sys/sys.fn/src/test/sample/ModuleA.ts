export const ModuleA = {
  name: 'ModuleA',
  sum(...numbers: number[]) {
    return numbers.reduce((acc, next) => acc + next, 0);
  },
} as const;

export default ModuleA;
