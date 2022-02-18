const { response } = require("express");
const pool = require("../database/conexion");
const Usuario = require("../models/usuario");


const getUsuarios = async (req, res = response) => {
    const id_cliente = req.id;
    //todos los usuarios con un limite de 20 sin que este el que hace la peticion ordenados por
    //los usuarios conectados
    const usuarios = await pool.query(
        "select * from users where id <> $1 order by  online desc limit 20", [id_cliente]);
    console.log(req.id);
    res.json({
        ok: true,
        usuarios: usuarios.rows
    })
}


module.exports = {
    getUsuarios
}