const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    const str = chunk.toString();
    const data = str.split(os.EOL);

    data.forEach((s, i) => {
      this.data += s;

      // Проверяем, что 'eol' не был в конце строки `z{os.Eol}ab{os.Eol}`
      if (i !== data.length-1 || s !== str[str.length-1]) {
        this.push(this.data);
        this.data = '';
      }
    });

    callback();
  }

  _flush(callback) {
    // Пушим остатки
    if (this.data.length) {
      this.push(this.data);
    }

    callback();
  }
}

module.exports = LineSplitStream;
