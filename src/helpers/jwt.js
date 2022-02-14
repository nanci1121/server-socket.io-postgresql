const jwt = require('jsonwebtoken');
const { resolve } = require('path/posix');






const generarJWT = (id) => {

        return new Promise((resolve,reject)=>{
            const payload = { id };

            jwt.sign(payload, process.env.JWT_KEY, {
                expiresIn: '24h'
            }, (err, token) => {
                if (err) {
                    //no se pudo crear el token
                    reject('No se pudo generar el JWT');
                }else{
                    //tenemos el Token
                    resolve(token);
                }
            });
        });


}


module.exports = {
    generarJWT
}
