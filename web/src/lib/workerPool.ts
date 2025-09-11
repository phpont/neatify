export type TaskType = "format" | "minify" | "ping";

type Task = {
  id: string;
  type: TaskType;
  code: string;
  options?: Record<string, unknown>;
  resolve: (s: string) => void;
  reject: (e: Error) => void;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createWorkerPool(size = 2) {
  let workers: Worker[] = [];
  let queue: Task[] = [];
  let next = 0;
  let warmed = false;

  function ensureWorkers() {
    if (workers.length) return;
    for (let i = 0; i < size; i++) {
      const w = new Worker(new URL("../workers/formatter.worker.ts", import.meta.url), {
        type: "module",
      });
      w.addEventListener("message", (evt: MessageEvent<any>) => {
        const task = (w as any)._currentTask as Task | undefined;
        if (!task || evt.data.id !== task.id) return;
        (w as any)._currentTask = undefined;
        if (evt.data.ok) task.resolve(evt.data.result || "");
        else task.reject(new Error(task.type + ": " + (evt.data.error || "failed")));
        schedule();
      });
      workers.push(w);
    }
  }

  function schedule() {
    for (let i = 0; i < workers.length; i++) {
      const w = workers[next++ % workers.length];
      const busy = Boolean((w as any)._currentTask);
      if (busy) continue;
      const task = queue.shift();
      if (!task) return;
      (w as any)._currentTask = task;
      w.postMessage({ id: task.id, type: task.type, code: task.code, options: task.options });
    }
  }

  async function run(type: TaskType, code: string, options: Record<string, unknown> = {}) {
    ensureWorkers();
    return new Promise<string>((resolve, reject) => {
      const id = Math.random().toString(36).slice(2);
      queue.push({ id, type, code, options, resolve, reject });
      schedule();
    });
  }

  async function warmUp() {
    ensureWorkers();
    try {
      await Promise.all(workers.map((_, i) => run("ping", "", { i })));
      warmed = true;
    } catch {
      warmed = false;
    }
    return warmed;
  }

  function isWarmed() {
    return warmed;
  }

  function dispose() {
    workers.forEach((w) => w.terminate());
    workers = [];
    queue = [];
  }

  return { run, warmUp, isWarmed, dispose };
}
