// import * as dotenv from "dotenv";
import { getPostData } from "./src/utils/reddit/posts.js";
import { editVideo, buildEditSpec } from "./src/utils/editor/editor.js";

import fs from "fs";

// dotenv.config();

async function main() {
  const args = getArgs();
  const postUrl = args.get("post-url");

  await generateVideo(postUrl);
  // remove tmp files
  // fs.rmdirSync(tmpDir, { recursive: true });
  console.log("Done!");
}

async function generateVideo(postUrl) {
  const post = await getPostData(postUrl);

  // edit video
  const editSpec = await buildEditSpec(post);
  await editVideo(editSpec);
}

function getArgs() {
  const args = process.argv.map((arg) => arg.split("="));
  const argMap = new Map<string, string>();
  args.forEach((arg) => {
    if (arg[0] === "post" || arg[0] === "p") {
      arg[0] = "post-url";
    }

    argMap.set(arg[0], arg[1]);
  });

  if (!argMap.has("post") && !argMap.has("post-url") && !argMap.has("p")) {
    throw new Error(
      "Missing required arguments, provide a post url with 'npm run start -- post=<url>'"
    );
  }

  return argMap;
}

main();
