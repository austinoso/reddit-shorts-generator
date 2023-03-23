import { generateVideo } from "../lib/shortVideoGenerator/generateVideo.js";
import Queue from "bull";

export async function addToVideoQueue(postUrl) {
  const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  let videoQueue = new Queue("video-queue", REDIS_URL);

  let job = await videoQueue.add(
    { postUrl: postUrl },
    { removeOnComplete: true, removeOnFail: true }
  );

  videoQueue.process(async (job, done) => {
    const { postUrl } = job.data;
    console.log("Generating video for post: ", postUrl);
    await sleep(5000);
    done();
    console.log("Done!");
  });

  return job;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
