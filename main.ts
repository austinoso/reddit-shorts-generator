// import * as dotenv from "dotenv";
import { fetchPost } from "./src/utils/reddit/posts.js";
import Screenshoter from "./src/Screenshoter.js";
import { editVideo, buildEditSpec } from "./src/utils/editor/editor.js";
import { buildTmpDir } from "./src/utils/buildTmpDir.js";

// dotenv.config();

async function main(postUrl) {
  const post = await fetchPost(postUrl);
  await saveComments(postUrl, post);

  // const editSpec = buildEditSpec();
  // await editVideo(editSpec);
  console.log("Done!");
}

async function saveComments(postUrl, post) {
  await buildTmpDir(post.id);
  await takeScreenshots(postUrl, post, 10);

  return post;
}

async function takeScreenshots(postUrl, post, amount) {
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
}

const postUrl =
  "https://www.reddit.com/r/AskReddit/comments/11r5b1r/whats_the_best_thing_about_the_us";

main(postUrl);
