import fs from "fs";

export async function buildTmpDir(postId: string) {
  const commentsDir = `./tmp/${postId}/comments`;
  const commentsDirExists = fs.existsSync(commentsDir);

  if (!commentsDirExists) {
    fs.mkdirSync(commentsDir, { recursive: true });
  }
}
