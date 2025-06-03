const World = require('../models/World')

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')                         // normaliza acentos
    .replace(/[\u0300-\u036f]/g, '')          // elimina acentos
    .replace(/[^a-z0-9]+/g, '-')              // reemplaza caracteres no alfanuméricos
    .replace(/^-+|-+$/g, '')                  // quita guiones al principio/fin
    .replace(/-+/g, '-')                      // colapsa múltiples guiones
}

async function generateUniqueSubdomain(name) {
  const base = slugify(name)
  let subdomain = base
  let count = 0

  while (await World.exists({ subdomain })) {
    count++
    subdomain = `${base}-${count}`
  }

  return subdomain
}

module.exports = generateUniqueSubdomain