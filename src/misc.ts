export function average(arr: number[]): number {
  return arr.reduce((p, c) => p + c, 0) / arr.length;
}
