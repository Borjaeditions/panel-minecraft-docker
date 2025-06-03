const World = require('../models/World')

const START_PORT = 30000
const END_PORT = 40000

async function assignAvailablePort() {
  const worlds = await World.find({}, 'port')
  const usedPorts = new Set(worlds.map(w => w.port))

  for (let port = START_PORT; port <= END_PORT; port++) {
    if (!usedPorts.has(port)) {
      return port
    }
  }

  throw new Error('No hay puertos disponibles')
}

module.exports = assignAvailablePort