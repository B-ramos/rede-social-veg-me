const express = require('express');
const router = express.Router();
const { store } = require('../controllers/comentarioController.js')

router.post('/post/:usuario_id/:post_id', store)

module.exports = router