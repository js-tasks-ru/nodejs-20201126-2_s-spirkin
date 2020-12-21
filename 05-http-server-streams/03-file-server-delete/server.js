const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('Nested paths are not supported');
      } else if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end(`File '${pathname}' not found`);
      } else {
        fs.unlink(filepath, (err) => {
          if (err) throw err;

          res.statusCode = 200;
          res.end('ok');
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
