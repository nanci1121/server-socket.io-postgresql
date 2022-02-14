/*

path: ???

*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { validarCampos } = require('../middelwares/validar-campos')
const { validarJWT } = require('../middelwares/validar-jwt');

const { todosUsuarios,
    usuarioId,
    login,
    deleteUsuario,
    createUsuario,
    updateUsuario,renewToken} = require("../controladores/usuarios_controller");

router.get('/users', todosUsuarios);
router.get('/users/:id', usuarioId);
router.post('/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(), validarCampos
    ], login);
router.post('/users',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(), validarCampos
    ], createUsuario);
router.get('/renew', validarJWT, renewToken); /* [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(), validarCampos
], validarJWT,  */
router.put('/users/:id', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(), validarCampos
], updateUsuario);
router.delete('/users/:id', deleteUsuario);



module.exports = router;