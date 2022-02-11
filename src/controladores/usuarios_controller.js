const pool = require("../database/conexion")


const todosUsuarios = async (req, res) => {
    const resultados = await pool.query("select * from users");
    res.status(200).json(resultados.rows);
};

const usuarioId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resultados = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (resultados.rowCount == 0) {
            res.json({
                id: id,
                mensaje: 'usuario con id ' + id + ' no se encuentra'
            })
        } else {
            res.json(resultados.rows);
        }
    } catch (error) {
        console.log(error.stack);
    }
};

const createUsuario = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        const existemail = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (existemail.rowCount > 0) {
            res.json({
                message: `Usuario con email:  ${email}  ya existe no se puede insertar`,
            })
        } else {
            const response = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
            res.json({
                message: `Usuario  ${name} añadido satisfactoriamente`,
            })
        }
    } catch (error) {
        console.log(error.stack)
    }
};

const updateUsuario = async (req, res) => {
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

const deleteUsuario = async (req, res) => {
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

module.exports = {
    todosUsuarios,
    usuarioId,
    deleteUsuario,
    createUsuario,
    updateUsuario

};

