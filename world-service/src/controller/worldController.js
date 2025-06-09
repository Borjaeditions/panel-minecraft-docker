const World = require('../models/World')
const plans = require('../plans.json')
const generateSubdomain = require('../utils/generateSubdomain')
const assignAvailablePort = require('../utils/assignPort')
const axios = require('axios')

exports.getWorlds = async (req, res) => {
  const userId = req.header('user-id')
  const worlds = await World.find({ owner: userId })
  res.json(worlds)
}

exports.createWorld = async (req, res) => {
  const userId = req.header('user-id')
  const { name, planKey, whitelist, accessType, allowCracked } = req.body

  const plan = plans.find(p => p.key === planKey)
  if (!plan) return res.status(400).json({ message: 'Plan inválido' })

  const port = await assignAvailablePort()
  const subdomain = await generateSubdomain(name)

  const newWorld = new World({
    name,
    owner: userId,
    port,
    subdomain,
    mode: plan.mode,
    ramGB: plan.ramGB,
    allowMods: plan.allowMods,
    allowPlugins: plan.allowPlugins,
    planName: plan.name,
    maxPlayers: parseInt(plan.playerRange.split('+')[0]),
    accessType,
    whitelist: accessType === 'whitelist' ? whitelist : [],
    allowCracked
  })

  try {
    await newWorld.save()

    // Crear contenedor Docker
    await axios.post('http://host.docker.internal:5050/containers', {
      subdomain,
      port,
      ramGB: plan.ramGB,
      allowCracked
    })

    res.status(201).json(newWorld)

  } catch (err) {
    if (err.code === 11000) {
      if (err.keyPattern?.name && err.keyPattern?.owner) {
        return res.status(400).json({ message: 'Ya tienes un mundo con ese nombre' })
      }
      if (err.keyPattern?.subdomain) {
        return res.status(400).json({ message: 'Ese subdominio ya está en uso' })
      }
    }
    res.status(500).json({ message: 'Error al crear el mundo' })
  }
}

exports.updateAccess = async (req, res) => {
  const { id } = req.params
  const { accessType, whitelist, allowCracked } = req.body

  const world = await World.findById(id)
  if (!world) return res.status(404).json({ message: 'Mundo no encontrado' })

  world.accessType = accessType
  world.whitelist = accessType === 'whitelist' ? whitelist : []
  world.allowCracked = allowCracked

  await world.save()

  if (accessType === 'whitelist' && Array.isArray(whitelist)) {
    try {
      await axios.post(`http://host.docker.internal:5050/containers/${world.subdomain}/whitelist`, {
        players: whitelist
      })
    } catch (err) {
      console.error('Error al actualizar whitelist en contenedor:', err.message)
    }
  }

  res.json(world)
}

exports.deleteWorld = async (req, res) => {
  const { id } = req.params

  const world = await World.findById(id)
  if (!world) return res.status(404).json({ message: 'Mundo no encontrado' })

  try {
    await axios.delete(`http://host.docker.internal:5050/containers/${world.subdomain}`)
  } catch (err) {
    console.error('Error al eliminar contenedor:', err.message)
  }

  await World.findByIdAndDelete(id)

  res.json({ message: 'Mundo eliminado y contenedor destruido' })
}
