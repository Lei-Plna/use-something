export function useConcurrency<
  Result,
  Callback extends PromiseCallback<Result> = PromiseCallback<Result>
>(limit: number = 3) {
  let running = 0;
  const queue: QueueItem<Result>[] = [];

  const run = async () => {
    if (running >= limit || queue.length <= 0) {
      return;
    }
    running++;
    const { resolve, reject, callback } = queue.shift()!;
    callback()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        running--;
        run();
      });
  };

  return (callback: Callback) =>
    new Promise<Result>((resolve, reject) => {
      queue.push({ resolve, reject, callback });
      run();
    });
}

interface PromiseCallback<Result> {
  (): Promise<Result>;
}

interface QueueItem<Result> {
  resolve: (result: Result) => void;
  reject: (error: Error) => void;
  callback: () => Promise<Result>;
}
