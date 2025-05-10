// default export
export default function Random<T>(arr: T[]): T[] {
  const len = arr.length;
  if (len <= 2) return [...arr];
  const i = Math.floor(Math.random() * len);
  let j = Math.floor(Math.random() * (len - 1));
  if (j >= i) j += 1;
  return [arr[i], arr[j]];
}
