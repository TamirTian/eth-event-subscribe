const map = {};

class PositionManger {
  get (contract) {
    return map[contract] = map[contract] || -1
  }

  set (contract, newNumber) {
    const number = map[contract] || -1;
    if (newNumber > number) map[contract] = newNumber
  }
}

module.exports = PositionManger;
