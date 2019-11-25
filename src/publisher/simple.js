class Publisher {
  publish (contract, logs) {
    logs.forEach(log => {
      console.log(contract, JSON.stringify(log))
    })
  }
}

module.exports = Publisher;
