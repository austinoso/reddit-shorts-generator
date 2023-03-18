import editly from "editly";
import { Post } from "../../../types/post";

export async function editVideo(editSpec: any) {
  await editly(editSpec);
}

export function buildEditSpec(videoData) {
  const wordsPerSecond = 4.5;

  const { layers, duration } = buildImageLayers(videoData, wordsPerSecond);

  const editSpec = {
    outPath: `../output/${[videoData.id]}/${videoData.title}.mp4`,
    height: 1920,
    width: 1080,
    defaults: {
      layer: { fontPath: "./assets/Patua_One/PatuaOne-Regular.ttf" },
      layerType: { "fill-color": { color: "#00aa00" } },
    },
    clips: [
      {
        layers: [buildVideoLayer(duration), ...layers],
        duration: duration,
      },
    ],
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

function buildImageLayers(videoData, wordsPerSecond) {
  const layers = [];

  const titleLayer = {
    type: "image-overlay",
    path: videoData.titleImage,
    stop: calulateDuration(videoData.title, wordsPerSecond),
  };

  layers.push(titleLayer);

  let runningDuration = titleLayer.stop;
  videoData.comments.forEach((comment) => {
    const layerDuration = calulateDuration(comment.body, wordsPerSecond);

    const commentLayer = {
      type: "image-overlay",
      path: comment.image,
      start: runningDuration,
      stop: layerDuration + runningDuration,
    };

    runningDuration += layerDuration;
    layers.push(commentLayer);
  });

  return { layers, duration: runningDuration };
}

function buildVideoLayer(duration) {
  const bkgVideolength = 486;
  const bkgVideoStart = Math.random() * (bkgVideolength - duration);

  return {
    type: "video",
    path: "./assets/mc-video.mp4",
    cutTo: bkgVideoStart,
    stop: duration,
  };
}
