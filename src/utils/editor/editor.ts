import editly from "editly";
import { Post } from "../../../types/post";

export async function editVideo(editSpec: any) {
  await editly(editSpec);
}

export function buildEditSpec(post: Post, screenshotSavePaths: any) {
  const wordsPerSecond = 2.5;

  // const editSpec = {
  //   outPath: `../output/${[post.id]}/${post.title}.mp4`,
  //   defaults: {
  //     layer: { fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf" },
  //     layerType: { "fill-color": { color: "#00aa00" } },
  //   },
  //   clips: [
  //     {
  //       duration: 2,
  //       layers: [
  //         { type: "rainbow-colors" },
  //         {
  //           type: "subtitle",
  //           text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
  //         },
  //         { type: "title", position: "top", text: "Subtitles" },
  //       ],
  //     },
  //     {
  //       duration: 2,
  //       layers: [
  //         { type: "fill-color" },
  //         {
  //           type: "title",
  //           position: { x: 0, y: 1, originY: "bottom" },
  //           text: "Custom position",
  //           zoomDirection: null,
  //         },
  //       ],
  //     },
  //   ],
  // };

  const editSpec = {
    outPath: `../output/${[post.id]}/${post.title}.mp4`,
    height: 1920,
    width: 1080,
    defaults: {
      layer: { fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf" },
      layerType: { "fill-color": { color: "#00aa00" } },
    },
    clips: [],
  };

  const titleClip = {
    duration: calulateDuration(post.title, wordsPerSecond),
    layers: [
      { type: "image", path: screenshotSavePaths.title, zoomDirection: null },
    ],
  };

  editSpec.clips.push(titleClip);

  return editSpec;
}

// temp function, can probably be replaced later with length of tts audio
function calulateDuration(text: string, wordsPerSecond: number) {
  return text.split(" ").length / wordsPerSecond;
}
