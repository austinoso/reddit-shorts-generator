import editly from "editly";
import { Post } from "../../../types/post";
import { getAudioDurationInSeconds } from "get-audio-duration";

export async function editVideo(editSpec: any) {
  await editly(editSpec);
}

export async function buildEditSpec(videoData) {
  const wordsPerSecond = 4.5;

  const { layers, duration, audioTracks } = await buildImageLayers(
    videoData,
    wordsPerSecond
  );

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
    audioTracks: audioTracks,
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

async function buildImageLayers(videoData, wordsPerSecond) {
  const layers = [];
  const audioTracks = [];

  const titleLayer = {
    type: "image-overlay",
    path: videoData.titleImage,
    stop: await getAudioDurationInSeconds(videoData.titleAudio),
  };

  layers.push(titleLayer);
  audioTracks.push(buildAudioTrack(videoData.titleAudio, 0));

  let runningDuration = titleLayer.stop;
  for (let i = 0; i < videoData.comments.length; i++) {
    const comment = videoData.comments[i];
    const layerDuration = await getAudioDurationInSeconds(comment.audio);

    const commentLayer = {
      type: "image-overlay",
      path: comment.image,
      start: runningDuration,
      stop: layerDuration + runningDuration,
    };

    layers.push(commentLayer);

    const audioTrack = buildAudioTrack(comment.audio, runningDuration);
    audioTracks.push(audioTrack);

    runningDuration += layerDuration + 0.5;
  }

  return { layers, duration: runningDuration, audioTracks };
}

function buildVideoLayer(duration) {
  const bkgVideolength = 486;
  const bkgVideoStart = Math.random() * (bkgVideolength - duration);

  return {
    type: "video",
    path: "./assets/mc-bkg-video.mp4",
    cutFrom: bkgVideoStart,
    cutTo: bkgVideoStart + duration,
  };
}

function buildAudioTrack(path, start) {
  return {
    path: path,
    start: start,
  };
}
