class PositionManger {
  constructor (db) {
    this.db = db
  }

  async get (contract) {
    const col = this.db.collection('position');
    const doc = await col.findOne({ contract });
    return doc ? doc.number : -1
  }

  async set (contract, newNumber) {
    const col = this.db.collection('position');
    await col.updateOne({ contract }, { $set: { number: newNumber } }, { upsert: true })
  }
}

module.exports = PositionManger;
