# Typescript Reddit video generator for YouTube Shorts/TikTok

Generates 60 second videos of the best comments from a Reddit post generating screenshots and audio tts for each comment.

`npm run start -- post-url=<REDDIT_POST>`

## Requirments

- Google Cloud authenticated locally with [gcloud-cli](https://cloud.google.com/sdk/gcloud) and a project enabled with [Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech)
- `ffmpeg`
- `ffprobe`
- `xvfb`

## Setup

- Create a .env file with `VIDEO_BACKGROUND` set to your background video file path
