const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {finished} = require('stream');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const FILE_LIMIT = 2 ** 20; // 1MB

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
        const limitSizeStream = new LimitSizeStream({limit: FILE_LIMIT});
        const writable = fs.createWriteStream(filepath);
        let statusCode = 201;

        req
            .pipe(limitSizeStream)
            .pipe(writable);

        finished(req, (err) => {
          if (err) {
            fs.unlink(filepath, (err) => {
              if (err) throw err;
              statusCode = 500;
              writable.end();
            });
          } else {
            // finished
          }
        });

        finished(limitSizeStream, (err) => {
          if (err) {
            if (['LIMIT_EXCEEDED'].includes(err)) {
              fs.unlink(filepath, (err) => {
                if (err) throw err;
                statusCode = 413;
                writable.end();
              });
            } else {
              statusCode = 500;
              writable.end();
            }
          } else {
            // finished
          }
        });

        finished(writable, (err) => {
          if (err) {
            fs.unlink(filepath, (err) => {
              if (err) throw err;
              statusCode = 500;
              res.end();
            });
          } else {
            res.statusCode = statusCode;
            res.end();
          }
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
