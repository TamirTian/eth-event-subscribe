const abi = require('web3-eth-abi')
const inputs = [
  { indexed: false, name: 'hash', type: 'bytes32' },
  { indexed: true, name: 'no', type: 'bytes32' },
  { indexed: false, name: 'token', type: 'address' },
  { indexed: false, name: 'from', type: 'address' },
  { indexed: false, name: 'value', type: 'uint256' }
]

const logs = [{
  "address": "0xdd3ca8e3ab79f9467a3E60A4eB3d5F67e71CEc9F",
  "topics": ["0xbfbed5b4c2aa51ea27300b765e087748357846c22a73c5f534f829472ef58bbf", "0xb51357dc55834fa044bc0392f86a37babf128762d27ccd2ba26f62a7f99276ca"],
  "data": "0x7ce52df6dc08bc9136c66d6bdd5c968c197aa4a267f14d8c886f17c8e82c86e900000000000000000000000000000000000000000000000000000000000000010000000000000000000000003ed0a6a4ef62e2b1d4a561a22b80a959e5cb334a00000000000000000000000000000000000000000000000000038d7ea4c68000",
  "blockNumber": 5502560,
  "transactionHash": "0x7462a6238c8a1aca41b6e779e8742d24b0c122aaeb9d53b5706c7ce9c3040497",
  "transactionIndex": 4,
  "blockHash": "0x71fe95f37523bb11863bbc04bdf0413d76db976ffb2f3780f88fe9c7a0e46646",
  "logIndex": 4,
  "removed": false,
  "id": "log_b80ae4e7"
}]

logs.forEach(log => {
  const topics = log.topics.slice(1)
  const data = abi.decodeLog(inputs, log.data, topics)
  console.log(log.topics[0], data)
})
