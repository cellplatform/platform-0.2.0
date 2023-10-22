export const go = `
// Q (Compute Language)
// example: Yao's hidden millionare:
// ref: https://quilibrium.com/docs

func main(a, b) bool {
  return a.TotalBalance < b.TotalBalance
}
`;

export const CODE_SAMPLES = {
  go,
} as const;
