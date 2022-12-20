import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const posts = await getPosts();
  console.log(posts);
}

async function getPosts() {
  const resData = await axios.get(
    "https://www.reddit.com/r/askreddit/hot.json"
  );

  const posts = resData.data.data.children;
  return posts;
}

main();
