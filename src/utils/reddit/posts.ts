import axios from "axios";
import { Post, Comment } from "../../../types/post";

export async function fetchPost(url): Promise<Post> {
  url = `${url}.json?sort=top`;

  const resData = await axios.get(url);

  const postData = resData.data[0].data.children[0].data;
  const commentsData = resData.data[1].data.children;

  // sort comments by top
  commentsData.sort((a, b) => b.data.score - a.data.score);

  // remove deleted comments
  const comments: Comment[] = [];
  commentsData.forEach((comment) => {
    const data = {
      body: comment.data.body,
      id: comment.data.name,
    };

    if (data.body && data.body !== "[deleted]") {
      comments.push(data);
    }
  });

  return {
    title: postData.title,
    id: postData.name,
    comments: comments,
  };
}
