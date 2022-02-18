/*

path: api/usuarios

*/

const { Router } = require('express');

const router = Router();


const { validarJWT } = require('../middelwares/validar-jwt');
const {getUsuarios} = require('../controladores/usuarios');


router.get('/', validarJWT, getUsuarios);


module.exports = router;