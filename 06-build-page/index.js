const {
  mkdir,
  readdir,
  readFile,
  writeFile,
  copyFile,
  unlink,
  appendFile,
  rmdir,
} = require('fs/promises');
const path = require('path');

const assetsPath = path.join(__dirname, 'assets');
const compPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist');

async function makeDir(dest) {
  await mkdir(dest, { recursive: true });
}

async function readDir(src) {
  const files = await readdir(src, { withFileTypes: true });
  return files;
}

async function delFiles(folder) {
  const files = await readDir(folder);
  for (const file of files) {
    if (file.isDirectory()) {
      await delFiles(path.join(folder, file.name));
      await rmdir(path.join(folder, file.name));
    } else {
      await unlink(path.join(folder, file.name));
    }
  }
}

async function copyDir(src, dest, files) {
  for (const file of files) {
    copyFile(path.join(src, file.name), path.join(dest, file.name));
  }
}

(async function () {
  await makeDir(destPath);
  await delFiles(destPath);
  let srcHTML = await readFile(path.join(__dirname, 'template.html'), 'utf-8');
  const components = await readDir(compPath);
  for (const comp of components) {
    if (comp.name.split('.')[1] === 'html') {
      const compSrc = await readFile(path.join(compPath, comp.name), 'utf-8');
      const compName = comp.name.split('.')[0];
      srcHTML = srcHTML.replace(`{{${compName}}}`, compSrc);
    }
  }
  await writeFile(path.join(destPath, 'index.html'), srcHTML);

  const styles = await readDir(stylesPath);
  for (const style of styles) {
    const styleSrc = await readFile(path.join(stylesPath, style.name), 'utf-8');
    const styleDest = path.join(destPath, 'style.css');
    await appendFile(styleDest, styleSrc);
  }

  const assetsDest = path.join(destPath, 'assets');
  await mkdir(assetsDest);
  const assets = await readDir(assetsPath);
  for (const asset of assets) {
    await makeDir(path.join(assetsDest, asset.name));

    const files = await readDir(path.join(assetsPath, asset.name));
    await copyDir(
      path.join(assetsPath, asset.name),
      path.join(assetsDest, asset.name),
      files
    );
  }
})();
