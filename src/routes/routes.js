const express = require('express');

const router = express.Router();
const {todosUsuarios,
    usuarioId,
    deleteUsuario,
    createUsuario,
    updateUsuario} = require("../controladores/usuarios_controller");

router.get('/users',todosUsuarios) ;
router.get('/users/:id', usuarioId);
router.post('/users', createUsuario);
router.put('/users/:id', updateUsuario);
router.delete('/users/:id', deleteUsuario);



module.exports = router;