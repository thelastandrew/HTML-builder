const { readdir, copyFile, mkdir, unlink } = require('fs/promises');
const path = require('path');

async function makeDir(dest) {
  await mkdir(dest, { recursive: true });
}

async function readDir(src) {
  const files = await readdir(src);
  return files;
}

async function delFiles(dest) {
  const files = await readdir(dest);
  for (const file of files) {
    unlink(path.join(dest, file));
  }
}

async function copyDir(src, dest, files) {
  await delFiles(dest);
  for (const file of files) {
    copyFile(path.join(src, file), path.join(dest, file));
  }
}

(async function () {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  await makeDir(destDir);
  const files = await readDir(srcDir);

  copyDir(srcDir, destDir, files);
})();
