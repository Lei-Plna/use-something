export function useEnhancedMap<K, V>(
  initialization?: Iterable<readonly [K, V]>
) {
  const map = new Map<K, V>(initialization);

  const get = (key: K) => map.get(key);

  const set = (key: K, value: V) => map.set(key, value);

  const remove = (key: K) => map.delete(key);

  const has = (key: K) => map.has(key);

  const getOrCreate = (key: K, factory: () => V) => {
    const v = factory();
    if (!map.has(key)) {
      map.set(key, v);
    }
    return v;
  };

  const ensure = (key: K) => {
    if (!map.has(key)) {
      throw new Error(`Key ${key} not found in map`);
    }
    return map.get(key);
  };

  const clear = () => map.clear();

  const size = () => map.size;

  return {
    get,
    set,
    remove,
    has,
    getOrCreate,
    ensure,
    clear,
    size
  };
}
