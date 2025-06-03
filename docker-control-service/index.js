// docker-control-service/index.js
const express = require('express')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const PORT = 5050

app.use(helmet())
app.use(cors())
app.use(express.json())

function isSafe(value) {
  return /^[a-zA-Z0-9_-]+$/.test(value)
}

app.post('/containers', (req, res) => {
  const { subdomain, port, ramGB, allowCracked } = req.body

  if (![subdomain, port, ramGB].every(Boolean)) {
    return res.status(400).json({ message: 'Faltan datos requeridos' })
  }

  if (!isSafe(subdomain)) {
    return res.status(400).json({ message: 'Nombre inválido' })
  }

  const containerName = `mc_${subdomain}`
  const memory = `${ramGB}G`
  const onlineMode = allowCracked ? 'false' : 'true'
  const worldPath = `/opt/mc/${containerName}`

  const command = `docker run -d \
    --name ${containerName} \
    -p ${port}:25565 \
    -e EULA=TRUE \
    -e MEMORY=${memory} \
    -e ONLINE_MODE=${onlineMode} \
    -v ${worldPath}:/data \
    itzg/minecraft-server`

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr)
      return res.status(500).json({ message: 'Error al crear contenedor' })
    }
    res.json({ message: 'Contenedor creado', containerId: stdout.trim() })
  })
})

app.post('/containers/:subdomain/whitelist', (req, res) => {
  const { subdomain } = req.params
  const { players } = req.body

  if (!isSafe(subdomain)) {
    return res.status(400).json({ message: 'Subdominio inválido' })
  }

  if (!Array.isArray(players)) {
    return res.status(400).json({ message: 'Lista de jugadores inválida' })
  }

  const containerName = `mc_${subdomain}`
  const worldPath = `/opt/mc/${containerName}`
  const whitelistPath = path.join(worldPath, 'whitelist.json')

  try {
    fs.mkdirSync(worldPath, { recursive: true })
    fs.writeFileSync(whitelistPath, JSON.stringify(players, null, 2))
    res.json({ message: 'Whitelist actualizada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al escribir whitelist' })
  }
})

app.delete('/containers/:subdomain', (req, res) => {
  const { subdomain } = req.params

  if (!isSafe(subdomain)) {
    return res.status(400).json({ message: 'Subdominio inválido' })
  }

  const containerName = `mc_${subdomain}`
  const command = `docker rm -f ${containerName}`

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr)
      return res.status(500).json({ message: 'Error al eliminar contenedor' })
    }
    res.json({ message: 'Contenedor eliminado', result: stdout.trim() })
  })
})

app.listen(PORT, () => console.log(`Docker control service en puerto ${PORT}`))