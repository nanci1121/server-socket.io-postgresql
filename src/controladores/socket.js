const Usuario = require('../models/usuario');
const pool = require("../database/conexion");


const usuarioConectado = async (id) => {
    //const id_db = parseInt(id);
    const usuari_db = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const usuario1 = new Usuario(usuari_db.rows[0].id,
        usuari_db.rows[0].name,
        usuari_db.rows[0].email,
        usuari_db.rows[0].password,
        usuari_db.rows[0].online);

    usuario1.online = false;
    
    await pool.query(
        'UPDATE users SET online = true WHERE id = $1', [usuario1.id]);
    //const usuari_db1 = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    
    return usuario1;
}

const usuarioDesconectado = async (id) => {

    const usuari_db = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const usuario = new Usuario(usuari_db.rows[0].id,
        usuari_db.rows[0].name,
        usuari_db.rows[0].email,
        usuari_db.rows[0].password,
        usuari_db.rows[0].online);

    usuario.online = true;
    const response = await pool.query(
        'UPDATE users SET online = false WHERE id = $1', [usuario.id]);
    return usuario;
}



module.exports = {
    usuarioConectado,
    usuarioDesconectado

}