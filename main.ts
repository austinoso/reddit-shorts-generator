// import * as dotenv from "dotenv";
import { generateVideo } from "./src/lib/shortVideoGenerator/generateVideo.js";

// dotenv.config();

async function main() {
  const postUrl = process.env.POST;
  console.log("Generating video for post: ", postUrl);
  await generateVideo(postUrl);

  console.log("Done!");
}

// const postUrl =
//   "https://www.reddit.com/r/AskReddit/comments/11r5b1r/whats_the_best_thing_about_the_us";

main();
