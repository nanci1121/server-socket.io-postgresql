
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado } = require('../controladores/socket');

//Mensajes sockets
io.on('connection', (client) => {

    //console.log('Cliente conectado');
    const x_token = client.handshake.headers['x-token'];
    const [valid, id] = comprobarJWT(x_token);

    //verificar autenticacion
    if (!valid) {
        return client.disconnect();
    }

    //cliente autenticado
    usuarioConectado(id);

    //desconectar cliente
    client.on('disconnect', () => {
        usuarioDesconectado(id)
    });


    /*     client.on('mensaje', (payload) => {
            console.log('Mensaje!!!', payload);
            io.emit('mensaje', { admin: "nuevo mensaje" });
        }); */

});