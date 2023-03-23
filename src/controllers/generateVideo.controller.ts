import { addToVideoQueue } from "../services/generateVideo.service.js";

export async function process(req, res, next) {
  try {
    const { postUrl } = req.body;
    const job = await addToVideoQueue(postUrl);
    res.json({ message: "Added video to queue", jobId: job.id });
  } catch (e) {
    console.log("Error creating video: ", e);
    next(e);
  }
}
