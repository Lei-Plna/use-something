import { describe, it, expect } from 'vitest';
import { useRemoveDuplicates, useSimpleRemoveDuplicates } from '../src/useSomething';

describe('test', () => {
  it('Object Array remove duplicated', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' }
    ];
    const result = useRemoveDuplicates(arr);
    expect(result).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' }
    ]);
  });

  it('Primitive Array remove duplicated', () => {
    const arr = [1, 2, 1];
    const result = useSimpleRemoveDuplicates(arr);
    expect(result).toEqual([1, 2]);
  });
});
