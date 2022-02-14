const pool = require("../database/conexion");
const { response } = require('express');
const bcrypt =require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");
const ResponseLike = require("responselike");


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
           
            res.json(resultado.rows);
        }
    } catch (error) {
        console.log(error.stack);
    }
};
const login = async (req, res = response) => { 
   
    try {
        const {password, email} = req.body;
        const resultados = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (resultados.rowCount == 0) {
            return res.status(404).json({   
                ok:false,             
                email: email,
                msg: 'usuario con email ' + email + ' no se encuentra'
            });
            
        } else {
            //validdar password
            const validPassword =bcrypt.compareSync(password, resultados.rows[0].password);
            if(!validPassword){
                return res.status(404).json({   
                    ok:false,             
                    email: password,
                    msg: 'la contraseña no es validad'
                });
            }else{
                const token =await generarJWT(resultados.rows[0].id);
                return res.status(200).json({   
                    ok:true,             
                    email: email,
                    token: token,
                    msg: 'login ok'
                });

            }
           
           return  res.status(200).json(resultados.rows[0].id);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:"Hable con el administrador"
        });
    }
};

const createUsuario = async (req, res = response) => {

   
    const { name, email, password } = req.body;
    try {

        const existemail = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (existemail.rowCount > 0) {
            res.json({
                message: `Usuario con email:  ${email}  ya existe no se puede insertar`,
            })
        } else {
            //encriptar contraseña
            const salt =bcrypt.genSaltSync();
            const password_enc = bcrypt.hashSync(password,salt);

            const response = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password_enc]);
            const id = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            const token = await generarJWT(id.rows[0].id);
            res.json({
                message: `Usuario  ${name} añadido satisfactoriamente `,
                token: token
            })
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
}

const renewToken = async ( req, res=response)=>{

    const id  = req.id;
    const token = await generarJWT(id);
    const usuarioDb = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    res.json({
        ok:true,
        id: usuarioDb.rows[0].id,
        name: usuarioDb.rows[0].name,
        password:usuarioDb.rows[0].password,
        token: token,
        
        msg: 'lo he renovado'
    })

}

module.exports = {
    renewToken,
    todosUsuarios,
    usuarioId,
    login,
    deleteUsuario,
    createUsuario,
    updateUsuario

};

