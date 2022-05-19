const fs = require('fs');
const path = require('path');
const {stdout} = process;

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));
const errorHandler = () => {
  console.log('Error');
  stream.destroy();
};

stream
  .on('error', errorHandler)
  .on('data', data => {stdout.write(data.toString());});
