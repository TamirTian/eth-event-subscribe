const _ = require('lodash');

function promisify (func, that) {
  return function () {
    const args = arguments;
    return new Promise((resolve, reject) => {
      func.call(that, ...args, function (error, data) {
        if (error) return reject(error);
        resolve(data)
      })
    })
  }
}

class Publisher {
  constructor (sqs, queueURL) {
    this.sqs = {
      receiveMessage: promisify(sqs.receiveMessage, sqs),
      sendMessage: promisify(sqs.sendMessage, sqs),
      deleteMessage: promisify(sqs.deleteMessage, sqs)
    };
    this.queueURL = queueURL
  }

  async publish (contract, logs) {
    const chunks = _.chunk(logs, 10);
    for (let i = 0; i < chunks.length; i++) {
      const params = {
        MessageBody: JSON.stringify(chunks[i]),
        QueueUrl: this.queueURL
      };
      await this.sqs.sendMessage(params)
    }
  }

}

module.exports = Publisher;
