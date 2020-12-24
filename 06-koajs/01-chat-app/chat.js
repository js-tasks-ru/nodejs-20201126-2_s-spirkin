class Chat {
  constructor() {
    this.clients = [];
  }

  subscribe(res) {
    this.clients.push(res);
  }

  publish(message) {
    this.clients.forEach((res) => {
      res(message);
    });
    this.clients.length = 0;
  }
}

module.exports = Chat;
