import { Worker } from "bullmq";
import Post from "../models/post.js";
import { workerConnection } from "../config/redis.js";
import { PUBLISH_QUEUE } from "../queues/publish.queue.js";

export const startPublishWorker = () => {
  const worker = new Worker(
    PUBLISH_QUEUE,
    async (job) => {
      const { postId } = job.data as { postId: string };

      const post = await Post.findOneAndUpdate(
        { _id: postId, status: "scheduled" },        
        { $set: { status: "published", publishedAt: new Date() } },
      );
      return post ? "published" : "skipped";
    },
    { connection: workerConnection, concurrency: 5, drainDelay: 30 },
  );

  worker.on("completed", (job, result) => console.log(`Job ${job.id}: ${result}`));

  worker.on("failed", async (job, err) => {
    console.error(`Job ${job?.id} failed (attempt ${job?.attemptsMade}):`, err.message);
    if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
      await Post.updateOne(
        { _id: job.data.postId, status: "scheduled" },
        { $set: { status: "failed" } },
      );
    }
  });

  worker.on("error", (err) => console.error("Worker error:", err.message));
  return worker;
};
