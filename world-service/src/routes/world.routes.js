const express = require('express')
const router = express.Router()
const controller = require('../controller/worldController')

router.get('/', controller.getWorlds)
router.post('/', controller.createWorld)
router.patch('/:id/access', controller.updateAccess)
router.delete('/:id', controller.deleteWorld)

module.exports = router