import textToSpeach from "@google-cloud/text-to-speech";
import fs from "fs";
import util from "util";

export async function textToSpeech(text: string, savePath: string) {
  const client = new textToSpeach.TextToSpeechClient();

  const [response] = await client.synthesizeSpeech({
    input: { text: text },
    voice: { languageCode: "en-US", name: "en-US-Neural2-J" },
    audioConfig: { audioEncoding: "LINEAR16", speakingRate: 1.41, pitch: 0 },
  });

  console.log(response);

  const writeFile = util.promisify(fs.writeFile);
  await writeFile(savePath, response.audioContent, "binary");
  console.log(`Audio content written to file: ${savePath}`);
  return savePath;
}

export async function generateAudio(videoData) {
  const comments = videoData.comments;

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    const audioPath = await textToSpeech(comment.text, comment.path);
    comment.audio = audioPath;
  }
}
