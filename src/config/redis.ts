import { Redis } from "ioredis";

const url = process.env.REDIS_URL;
if (!url) throw new Error("REDIS_URL is not defined in the environment variables");
if (!/^rediss?:\/\//.test(url)) {
  throw new Error("REDIS_URL must start with redis:// or rediss://");
}


const base = {
  keepAlive: 10000,
  connectTimeout: 20000,
  retryStrategy: (times: number) => Math.min(times * 500, 5000),
};

export const workerConnection = new Redis(url, { ...base, maxRetriesPerRequest: null });

export const queueConnection = new Redis(url, {
  ...base,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
});

queueConnection.on("error", (e) => console.error("Queue redis error:", e.message));
workerConnection.on("error", (e) => console.error("Worker redis error:", e.message));
