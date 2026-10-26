import { Queue } from "bullmq";
import { queueConnection } from "../config/redis.js";

export const PUBLISH_QUEUE = "publish-post";

export const publishQueue = new Queue(PUBLISH_QUEUE, { connection: queueConnection });

export const enqueuePublish = (postId: string, scheduledAt: Date) =>
  publishQueue.add(
    "publish",
    { postId },
    {
      jobId: `post-${postId}`,                       
      delay: Math.max(0, scheduledAt.getTime() - Date.now()),
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 }, 
      removeOnComplete: true,
      removeOnFail: 100,
    },
  );
