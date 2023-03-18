import axios from "axios";
import { Post, Comment } from "../../../types/post";

export async function fetchPost(url): Promise<Post> {
  url = `${url}.json?sort=top`;

  const resData = await axios.get(url);

  const postData = resData.data[0].data.children[0].data;
  const commentsData = resData.data[1].data.children;

  // sort comments by top
  commentsData.sort((a, b) => b.data.score - a.data.score);

  const comments: Comment[] = [];

  for (let i = 0; i < commentsData.length; i++) {
    const comment = commentsData[i].data;

    // skip unusable comments
    if (!comment.body) continue;
    if (comment.body === "[deleted]") continue;
    if (comment.body === "[removed]") continue;
    if (comment.body.length > 800) continue;

    comments.push({
      body: comment.body,
      id: comment.name,
    });
  }

  return {
    title: postData.title,
    id: postData.name,
    comments: comments,
  };
}
