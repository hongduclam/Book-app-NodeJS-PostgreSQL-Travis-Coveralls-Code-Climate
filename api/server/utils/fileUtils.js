const fs = require('fs');

export async function createFilePromise(filePath, content) {
  return new Promise((rs, rj) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        rj(err);
      }
      rs(true);
    });
  });
}

export async function readFilePromise(filePath) {
  return new Promise((rs, rj) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        rj(err);
      }
      rs(content);
    });
  });
}
