// // import * as dotenv from "dotenv";
// import { generateVideo } from "./src/lib/shortVideoGenerator/generateVideo.js";

// // dotenv.config();

// async function main() {
//   // const postUrl = process.env.POST;
//   // console.log("Generating video for post: ", postUrl);
//   // await generateVideo(postUrl);
//   // console.log("Done!");
// }

// // const postUrl =
// //   "https://www.reddit.com/r/AskReddit/comments/11r5b1r/whats_the_best_thing_about_the_us";

// main();

import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import videoRouter from "./src/routes/video.route.js";

const app: Express = express();
const port = process.env.PORT || 7777;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/video", videoRouter);

app.listen(port, () => {
  console.log(`Reddit Shorts Bot Running on http://localhost:${port}`);
});
