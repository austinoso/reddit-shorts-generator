import axios from "axios";

export async function fetchPost(url) {
  const resData = await axios.get(url);

  const postData = resData.data[0].data.children[0].data;
  const commentsData = resData.data[1].data.children;

  return {
    title: postData.title,
    comments: commentsData.map((comment) => comment.data.body),
  };
}
