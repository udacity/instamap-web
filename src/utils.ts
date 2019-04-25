export function removeFirstFromArray<T>(array: T[], item: T): T[] {
  const idx = array.indexOf(item)
  if (idx > -1) array.splice(idx, 1)
  return array
}

export function mergeArraysUnique<T>(array1: T[], array2: T[]): T[] {
  const set = new Set(array1)
  for (const x of array2) set.add(x)
  return Array.from(set)
}
