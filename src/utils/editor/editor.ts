import editly from "editly";
import { Post } from "../../../types/post";

export async function editVideo(editSpec: any) {
  await editly(editSpec);
}

export function buildEditSpec(videoData) {
  const wordsPerSecond = 4.5;

  const editSpec = {
    outPath: `../output/${[videoData.id]}/${videoData.title}.mp4`,
    height: 1920,
    width: 1080,
    defaults: {
      layer: { fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf" },
      layerType: { "fill-color": { color: "#00aa00" } },
    },
    clips: buildImageClips(videoData, wordsPerSecond),
  };

  return editSpec;
}

// temp function, can probably be replaced later with length of tts audio
function calulateDuration(text: string, wordsPerSecond: number) {
  return text.split(" ").length / wordsPerSecond;
}

function buildImageClips(videoData, wordsPerSecond) {
  const clips = [];

  const titleClip = {
    duration: calulateDuration(videoData.title, wordsPerSecond),
    layers: [
      { type: "image", path: videoData.titleImage, zoomDirection: null },
    ],
  };

  clips.push(titleClip);

  videoData.comments.forEach((comment) => {
    const commentClip = {
      duration: calulateDuration(comment.body, wordsPerSecond),
      layers: [{ type: "image", path: comment.image, zoomDirection: null }],
    };

    clips.push(commentClip);
  });

  return clips;
}
