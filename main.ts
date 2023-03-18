// import * as dotenv from "dotenv";
import { fetchPost } from "./src/utils/reddit/posts.js";
import Screenshoter from "./src/Screenshoter.js";
import { editVideo, buildEditSpec } from "./src/utils/editor/editor.js";
import { buildTmpDir } from "./src/utils/buildTmpDir.js";
import { Post } from "./types/post.js";

// dotenv.config();

async function main(postUrl: string) {
  const post = await fetchPost(postUrl);
  const screenshotSavePaths = await saveComments(postUrl, post);

  const editSpec = buildEditSpec(post, screenshotSavePaths);
  // await editVideo(editSpec);
  console.log("Done!");
}

async function saveComments(postUrl: string, post: Post) {
  await buildTmpDir(post.id);
  const screenshotSavePaths = await takeScreenshots(postUrl, post, 10);

  return screenshotSavePaths;
}

async function takeScreenshots(postUrl: string, post: Post, amount: number) {
  const comments = post.comments;

  const screenshoter = new Screenshoter();
  await screenshoter.init();
  await screenshoter.gotoPage(`${postUrl}?sort=top`);

  const screenshotSavePaths = {
    title: "",
    comments: [],
  };

  screenshotSavePaths.title = await screenshoter.takeScreenshootfTitle(post.id);

  for (let i = 0; i < amount; i++) {
    const comment = comments[i];
    const savePath = await screenshoter.takeScreenshotOfComment(
      comment.id,
      post.id
    );

    screenshotSavePaths.comments.push(savePath);
  }

  await screenshoter.close();

  return screenshotSavePaths;
}

const postUrl =
  "https://www.reddit.com/r/AskReddit/comments/11r5b1r/whats_the_best_thing_about_the_us";

main(postUrl);
