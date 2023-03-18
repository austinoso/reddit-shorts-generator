// import * as dotenv from "dotenv";
import { fetchPost } from "./src/utils/reddit/posts.js";
import Screenshoter from "./src/Screenshoter.js";
import { editVideo, buildEditSpec } from "./src/utils/editor/editor.js";
import { buildTmpDir } from "./src/utils/buildTmpDir.js";
import { Post } from "./types/post.js";
import fs from "fs";

// dotenv.config();

async function main(postUrl: string) {
  const post = await fetchPost(postUrl);
  const tmpDir = await buildTmpDir(post.id);

  // get video data
  const screenshotSavePaths = await saveComments(postUrl, post);
  const videoData = buildVideoData(post, screenshotSavePaths);

  // edit video
  const editSpec = buildEditSpec(videoData);
  await editVideo(editSpec);

  // remove tmp files
  fs.rmdirSync(tmpDir, { recursive: true });
  console.log("Done!");
}

async function saveComments(postUrl: string, post: Post) {
  const screenshotSavePaths = await takeScreenshots(postUrl, post, 10);
  return screenshotSavePaths;
}

async function takeScreenshots(postUrl: string, post: Post, amount: number) {
  const comments = post.comments;

  const screenshoter = new Screenshoter();
  await screenshoter.init();
  await screenshoter.gotoPage(`${postUrl}?sort=top`);

  const screenshotSavePaths = {
    title: {},
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

function buildVideoData(post: Post, screenshotSavePaths: any) {
  const data = {
    title: post.title,
    titleImage: screenshotSavePaths.title.path,
    id: post.id,
    comments: [],
  };

  screenshotSavePaths.comments.forEach((comment: any) => {
    const commentData = post.comments.find((c: any) => c.id === comment.id);
    // remove \n from comment
    commentData.body = commentData.body.replace(/(\r\n|\n|\r)/gm, "");

    data.comments.push({
      ...commentData,
      image: comment.path,
    });
  });

  return data;
}

const postUrl =
  "https://www.reddit.com/r/AskReddit/comments/11r5b1r/whats_the_best_thing_about_the_us";

main(postUrl);
