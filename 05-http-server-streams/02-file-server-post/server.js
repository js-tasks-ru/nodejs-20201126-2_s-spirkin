const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const FILE_LIMIT = 60000;

  switch (req.method) {
    case 'POST':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('Nested paths are not supported');
      } else if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end(`File '${pathname}' already exist`);
      } else {
        // Запись
        const limitSizeStream = new LimitSizeStream({limit: FILE_LIMIT, filepath});
        const file = fs.createWriteStream(filepath);
        let data;

        req.on('data', (chunk) => {
          limitSizeStream.write(chunk, (err) => {
            if (err && err.code === 'LIMIT_EXCEEDED') {
              console.log('here');
              res.statusCode = 413;
              res.end;
            } else {
              data += chunk;
            }
          });
        });

        req.on('end', () => {
          console.log('end');
          file.write(data);
          res.statusCode = 201;
          res.end();
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
