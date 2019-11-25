const Eth = require('web3-eth');
const utils = require('web3-utils');
const Provider = require('web3-request-provider');

class Subscriber {
  constructor ({ contract, rpc, positionManger, publisher, blockSubscriber }) {
    this.eth = new Eth(new Provider(rpc));
    this.positionManger = positionManger;
    this.publisher = publisher;
    this.blockSubscriber = blockSubscriber;
    this.contract = utils.toChecksumAddress(contract);
    this._running = true;
    this._confirmationBlockNumber = 8
  }

  _get ({ contract, begin, end }) {
    return this.eth.getPastLogs({
      address: contract,
      fromBlock: begin,
      toBlock: end
    })
  }

  _getHighest () {
    return Math.max(0, this.blockSubscriber.get().number - this._confirmationBlockNumber)
  }

  async _loop ({ contract, begin }) {
    const that = this;
    if (!this._running) return;
    let highest = this._getHighest();
    if (begin > highest) {
      setTimeout(() => that._loop({ contract, begin }), 1000);
      return
    }
    const end = Math.min(begin + 100, highest);
    console.log(`Fetch the logs of ${begin}-${end} of block`);
    try {
      const logs = await this._get({ contract, begin, end });
      await this.publisher.publish(contract, logs);
      await this.positionManger.set(contract, end);

      highest > end
        ? setTimeout(() => that._loop({ contract, begin: end + 1 }), 100)
        : setTimeout(() => that._loop({ contract, begin: end + 1 }), 1000)
    } catch (e) {
      console.error(e);
      setTimeout(() => this._loop({ contract, begin }), 1000)
    }
  }

  stop () {
    this._running = false
  }

  async start () {
    let position = await this.positionManger.get(this.contract);
    position = position <= 0 ? this._getHighest() : parseInt(position);

    const begin = position + 1;
    console.info(`Started at ${begin}`);
    this._loop({ contract: this.contract, begin })
  }
}

module.exports = Subscriber;
