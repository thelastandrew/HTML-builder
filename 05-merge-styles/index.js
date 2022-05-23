const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises');

const destFile = path.join(__dirname, 'project-dist', 'bundle.css');
const srcDir = path.join(__dirname, 'styles');
let styles = [];

(async function () {
  const files = await readdir(srcDir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(srcDir, file.name);
    const fileExt = path.extname(filePath);

    if (fileExt === '.css') {
      const content = await readFile(filePath, 'utf-8');
      styles.push(`${content}\n`);
    }

    await writeFile(destFile, styles, (err) => {
      if (err) throw err;
    });
  }
})();
