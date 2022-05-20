const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Введите данные для записи в файл text.txt:\n');
stdin.on('data', (data) => {
  process.on('SIGINT', () => {
    process.exit();
  });
  let input = data.toString().trim();
  if (input === 'exit') {
    process.exit();
  }
  stream.write(data);
});
process.on('exit', () => stdout.write('Удачи!'));
