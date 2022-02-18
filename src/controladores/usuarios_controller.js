const pool = require("../database/conexion");
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/usuario");


const todosUsuarios = async (req, res = response) => {
    const resultados = await pool.query("select * from users");
    res.status(200).json(resultados.rows);
};

const usuarioId = async (req, res = response) => {
    try {
        const id = parseInt(req.params.id);
        const resultados = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (resultados.rowCount == 0) {
            res.json({
                id: id,
                mensaje: 'usuario con id ' + id + ' no se encuentra'
            })

        } else {

            res.json(resultados.rows[0]);
        }
    } catch (error) {
        console.log(error.stack);
    }
};
const login = async (req, res = response) => {

    try {
        const { password, email } = req.body;

        const resultados = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (resultados.rowCount == 0) {
            return res.status(404).json({
                ok: false,
                email: email,
                msg: 'usuario con email ' + email + ' no se encuentra'
            });

        } else {
            //validdar password
            const validPassword = bcrypt.compareSync(password, resultados.rows[0].password);
            if (!validPassword) {
                return res.status(404).json({
                    ok: false,
                    email: password,
                    msg: 'la contraseña no es validad'
                });
            } else {
                const user = new Usuario(resultados.rows[0].id,
                    resultados.rows[0].name,
                    resultados.rows[0].email,
                    resultados.rows[0].password,
                    resultados.rows[0].online);


                const token = await generarJWT(resultados.rows[0].id);
                return res.status(200).json({
                    ok: true,
                    usuario: user,
                    token: token
                });

            }

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
};

const createUsuario = async (req, res = response) => {


    try {
        const { name, email, password } = req.body;

        const existemail = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (existemail.rowCount > 0) {
            res.status(400).json({
                ok:false,
                email: email,
                msg: `Usuario con email:  ${email}  ya existe no se puede insertar`,
            });
        } else {
            //encriptar contraseña
            const salt = bcrypt.genSaltSync();
            const password_enc = bcrypt.hashSync(password, salt);
            await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password_enc]);
            //obtenemos el usuario recien grabado.
            const id = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            const user = new Usuario(id.rows[0].id, name, email, password_enc,id.rows[0].online);
            const token = await generarJWT(id.rows[0].id);
            res.status(200).json({
                ok: true,
                usuario: user,
                token: token
            });
        }
    } catch (error) {
        console.log(error.stack)
    }
};

const updateUsuario = async (req, res = response) => {
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;
    try {
        const existeid = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const existemail = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (existeid.rowCount == 0 || existemail.rowCount > 0) {
            if (existemail.rowCount > 0) {
                res.json({
                    id: id,
                    mensaje: `usuario con email ${email} ya existe`
                })
            } else {
                res.json({
                    id: id,
                    mensaje: `usuario con id ${id} no se encuentra`
                })
            }
        } else {
            const response = await pool.query('UPDATE users SET name = $1, email = $2 , password = $3 WHERE id = $4', [
                name,
                email,
                password,
                id
            ]);
            res.json('Usuario Updated Successfully');
        }
    } catch (error) {
        console.log(error.stack)
    }
};

const deleteUsuario = async (req, res = response) => {
    const id = parseInt(req.params.id);
    try {
        const existeid = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (existeid.rowCount == 0) {
            res.json({
                id: id,
                mensaje: `usuario con id  ${id} no se encuentra`
            })
        } else {
            const response = await pool.query('DELETE FROM users where id = $1', [id]);
            res.json(`Usuario ${id} eliminado satisfactoriamente`);
        }
    } catch (error) {
        console.log(error.stack)
    }
};

const renewToken = async (req, res = response) => {

    const id = req.id;
    const token = await generarJWT(id);
    const usuarioDb = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = new Usuario(usuarioDb.rows[0].id, usuarioDb.rows[0].name, usuarioDb.rows[0].email,usuarioDb.rows[0].password ,usuarioDb.rows[0].online)
   

    res.json({
        ok: true,
        usuario:user,
        token: token,

        // msg: 'lo he renovado'
    })

};

module.exports = {
    renewToken,
    todosUsuarios,
    usuarioId,
    login,
    deleteUsuario,
    createUsuario,
    updateUsuario

};

