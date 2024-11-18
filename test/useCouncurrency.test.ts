import { describe, expect, it } from 'vitest';
import { useConcurrency } from '../src/useConcurrency';

describe('useConcurrency', () => {
  it('should run tasks concurrently', async () => {
    const concurrency = useConcurrency<number>(2);
    const tasks = Array.from(
      { length: 5 },
      (_, i) => () =>
        new Promise<number>((resolve) => {
          setTimeout(() => {
            resolve(i);
          }, 100);
        })
    );

    const times = Date.now();
    await Promise.all(tasks.map((task) => concurrency(task)));
    const time = Date.now() - times;
    expect(time).toBeGreaterThanOrEqual(500);
  });
});
