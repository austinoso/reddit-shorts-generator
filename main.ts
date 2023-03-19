// import * as dotenv from "dotenv";
import { getPostData } from "./src/utils/reddit/posts.js";
import { editVideo, buildEditSpec } from "./src/utils/editor/editor.js";

import fs from "fs";

// dotenv.config();

async function main(postUrl: string) {
  const post = await getPostData(postUrl);

  // edit video
  const editSpec = await buildEditSpec(post);
  await editVideo(editSpec);

  // remove tmp files
  // fs.rmdirSync(tmpDir, { recursive: true });
  console.log("Done!");
}

const postUrl =
  "https://www.reddit.com/r/AskReddit/comments/11r5b1r/whats_the_best_thing_about_the_us";

main(postUrl);
