const express = require('express')
const path = require('path');
require('dotenv').config();


//APP de express
const app = express()
const port = process.env.PORT;

//Node Server
const server = require('http').createServer(app);
module.exports. io = require('socket.io')(server);

require('./sockets/socket');


//Path publico
const publicPath =path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api',require('./routes/routes'))

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
