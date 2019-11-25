const Subscriber = require('../src')
const BlockSubscriber = require('../src/block-subscriber')
const PositionManger = require('../src/position/simple')
const Publisher = require('../src/publisher/sqs')
const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-northeast-1' })
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

const rpc = process.env.RPC
// USDT
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const queueURL = process.env.QUEUE_URL

async function main () {
  // stored position
  const positionManger = new PositionManger()
  // publish the logs to some store
  const publisher = new Publisher(sqs, queueURL)
  // sub highest block
  const blockSubscriber = new BlockSubscriber(rpc)
  // wait for start
  await blockSubscriber.start()

  // sub event logs of ethereum
  const subscriber = new Subscriber({ contract: contractAddress, rpc, positionManger, publisher, blockSubscriber })
  subscriber.start()

  // exit after 100 seconds
  setTimeout(() => {
    subscriber.stop()
    blockSubscriber.stop()
  }, 100 * 1000)
}

main()
