import editly from "editly";
import { Post } from "../../../types/post";
import { getAudioDurationInSeconds } from "get-audio-duration";

export async function editVideo(editSpec: any) {
  await editly(editSpec);
}

export async function buildEditSpec(post) {
  const { layers, duration, audioTracks } = await buildTracks(post);

  const editSpec = {
    outPath: `../output/${[post.id]}/${post.title.text}.mp4`,
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

async function buildTracks(post) {
  const layers = [];
  const audioTracks = [];

  const titleLayer = {
    type: "image-overlay",
    path: post.title.image,
    stop: post.title.duration,
  };

  layers.push(titleLayer);
  audioTracks.push(buildAudioTrack(post.title.audio, 0));

  let runningDuration = titleLayer.stop;
  for (let i = 0; i < post.comments.length; i++) {
    const comment = post.comments[i];

    const commentLayer = {
      type: "image-overlay",
      path: comment.image,
      start: runningDuration,
      stop: comment.duration + runningDuration,
    };

    layers.push(commentLayer);

    const audioTrack = buildAudioTrack(comment.audio, runningDuration);
    audioTracks.push(audioTrack);

    runningDuration += comment.duration;
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
