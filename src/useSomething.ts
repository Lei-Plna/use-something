/**
 * Remove duplicates from an array, It will allow you to pass a function to get the target value to compare.
 * Or it can be empty if you want to compare the whole object.
 * @attention before you use this function, make sure the comparison target is unique. e.g. if they have same id but different properties, it will not work correctly.
 * @param arr compared array
 * @param getTarget a function to get the target value to compare
 * @returns a new array without duplicates
 * @example
 * ```js
 * const arr = [
 *   { id: 1, name: 'a' },
 *   { id: 2, name: 'b' },
 *   { id: 1, name: 'a' }
 * ];
 * // result: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
 * const result = useRemoveDuplicates(arr, (item) => item.id);
 *
 * // but if same id but different name, it will be wrong like this:
 * const arr = [
 *   { id: 1, name: 'a' },
 *   { id: 2, name: 'b' },
 *   { id: 1, name: 'c' }
 * ];
 * // result: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
 * const result = useRemoveDuplicates(arr, (item) => item.id);
 * ```
 */
export function useSimpleDeDuplicate<T, R>(
  arr: T[],
  getTarget?: (item: T) => R
) {
  const targetMap = new Map<R | T, T>();
  arr.forEach((item) => {
    const target = getTarget ? getTarget(item) : item;
    if (!targetMap.has(target)) {
      targetMap.set(target, item);
    }
  });
  return Array.from(targetMap.values());
}

/**
 * complex version of useSimpleRemoveDuplicates, it can compare the whole object.
 * and it can solve the problem of same id but different properties.
 * @param arr  compared array
 * @returns a new array without duplicates
 * @example
 * ```js
 * const arr = [
 *   { id: 1, name: 'a' },
 *   { id: 2, name: 'b' },
 *   { id: 1, name: 'c' }
 * ];
 * // result: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
 * const result = useRemoveDuplicates(arr);
 * ```
 */
export function useDeDuplicate<T>(arr: T[]) {
  if (!arr.length) return arr;
  if (!isObjectArray(arr)) {
    return Array.from(new Set(arr));
  }
  // type-coverage:ignore-next-line
  let _arr = arr as Record<PropertyKey, unknown>[];
  for (let i = 0; i < _arr.length; i++) {
    const outer = _arr[i];
    const outerKeys = Object.keys(outer);
    for (let j = i + 1; j < _arr.length; j++) {
      const inner = _arr[j];
      const innerKeys = Object.keys(inner);
      if (outerKeys.length !== innerKeys.length) continue;

      const isMatch = outerKeys.every((key) => {
        return outer[key] === inner[key];
      });

      if (isMatch) {
        _arr = _arr.toSpliced(j, 1);
        j--;
      }
    }
  }

  return _arr;
}

function isObject(obj: unknown): obj is Record<PropertyKey, unknown> {
  return typeof obj === 'object' && obj !== null;
}

function isObjectArray(arr: unknown[]): arr is Record<PropertyKey, unknown>[] {
  return !!arr.length && isObject(arr[0]);
}
