const { readdir, stat } = require('fs/promises');
const path = require('path');

(async () => {
  const files = await readdir(path.join(__dirname, 'secret-folder'), {
    withFileTypes: true,
  });

  for (const file of files) {
    if (file.isFile()) {
      const fullDir = file.name;
      const fileName = fullDir.split('.')[0];

      const filePath = path.join(__dirname, 'secret-folder', fullDir);
      const fileType = path.extname(filePath).substring(1);
      const stats = await stat(filePath);

      console.log(
        `${fileName} - ${fileType} - ${(stats.size / 1024).toFixed(3)}kb`
      );
    }
  }
})();
