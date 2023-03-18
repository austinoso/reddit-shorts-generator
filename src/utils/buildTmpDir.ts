import fs from "fs";

export async function buildTmpDir(postId: string) {
  const tmpDir = `./tmp/${postId}`;
  const commentsDir = `${tmpDir}/comments`;
  const commentsDirExists = fs.existsSync(commentsDir);

  if (!commentsDirExists) {
    fs.mkdirSync(commentsDir, { recursive: true });
  }

  return tmpDir;
}
