import axios from "axios";
import { Post, Comment } from "../../../types/post";
import { textToSpeech } from "../../utils/google/textToSpeech.js";
import Screenshoter from "../../Screenshoter.js";
import { buildTmpDir } from "../../utils/buildTmpDir.js";

export async function getPostData(url): Promise<Post> {
  const jsonUrl = `${url}.json?sort=top`;

  const resData = await axios.get(jsonUrl);

  const postData = resData.data[0].data.children[0].data;
  const commentsData = resData.data[1].data.children;

  // sort comments by top
  commentsData.sort((a, b) => b.data.score - a.data.score);

  const screenshoter = new Screenshoter();
  await screenshoter.init(`${url}?sort=top`);

  const tmpDir = await buildTmpDir(postData.name);
  const title = await buildTitle(postData, screenshoter);
  const { comments, duration } = await buildComments(
    postData,
    commentsData,
    screenshoter,
    title
  );

  await screenshoter.close();

  return {
    title: title,
    id: postData.name,
    comments: comments,
    duration: duration,
    fileDir: tmpDir,
  };
}

async function buildTitle(postData, screenshoter) {
  // get title image audio
  const { savePath: titleAudioPath, duration: titleDuration } =
    await textToSpeech(postData.title, `./tmp/${postData.name}/title.mp3`);

  // get title image
  const { path: titleImagePath } = await screenshoter.takeScreenshotOfTitle(
    postData.name
  );

  const title = {
    text: postData.title,
    audio: titleAudioPath,
    duration: titleDuration,
    image: titleImagePath,
  };

  return title;
}

async function buildComments(postData, commentsData, screenshoter, title) {
  const comments: Comment[] = [];

  let runningAudioDuration = title.duration;
  for (let i = 0; i < commentsData.length; i++) {
    const comment = commentsData[i].data;

    // skip unusable comments
    if (!comment.body) continue;
    if (comment.body === "[deleted]") continue;
    if (comment.body === "[removed]") continue;
    if (comment.body.length > 800) continue;

    // get comment audio
    const { savePath: audioPath, duration } = await textToSpeech(
      comment.body,
      `./tmp/${postData.name}/comments/${comment.name}.mp3`
    );

    if (runningAudioDuration + duration >= 60) break; // max 60 seconds
    runningAudioDuration += duration;

    // get comment image
    const { path } = await screenshoter.takeScreenshotOfComment(
      comment.name,
      postData.name
    );

    comments.push({
      body: comment.body,
      id: comment.name,
      audio: audioPath,
      image: path,
      duration: duration,
    });

    if (comments.length >= 20) break; // max 20 comments (we shouldn't be here anyway)
  }

  return { comments, duration: runningAudioDuration };
}
