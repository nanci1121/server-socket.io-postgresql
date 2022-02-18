
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
    const id1 = String(id);
    //cliente autenticado
    usuarioConectado(id1);

    //ingresar al usuario a una sala especifica
    //Sala Global,cliente id, sala con nombre del id,
    client.join(id1);


    //escuchar del cliente el mensaje-personal
    client.on('mensaje-personal',(payload)=>{
        console.log(payload);
        io.to(payload.para).emit('mensaje-personal',payload);

    });


    //desconectar cliente
    client.on('disconnect', () => {
        usuarioDesconectado(id)
    });


    /*     client.on('mensaje', (payload) => {
            console.log('Mensaje!!!', payload);
            io.emit('mensaje', { admin: "nuevo mensaje" });
        }); */

});