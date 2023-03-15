import * as dotenv from "dotenv";
import { fetchPost } from "./src/utils/reddit/posts";

dotenv.config();

async function main() {
  const url =
    "https://www.reddit.com/r/AskReddit/comments/11r5b1r/whats_the_best_thing_about_the_us.json";

  const posts = await fetchPost(url);
  console.log(posts);
}

main();
