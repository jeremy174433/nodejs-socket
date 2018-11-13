const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
    var connectedUsers = Object.keys(io.sockets.clients().connected); // Connected users
    console.log('user connected : ', socket.id);
    socket.on('loaded', (data) => {
        console.log('data from client : ', data);
    });
    socket.on('user', (data) => {
        socket.pseudo = data;
        generateListUser();
    });
    socket.on('message', (data) => {
        socket.broadcast.emit('message', data); // Affiche les messages côté serveur
    });

    // Connected users
    io.emit('listConnectedUsers', connectedUsers);
    function generateListUser(){
        var userList = [];
        console.log(userList);
        var clientList = io.sockets.clients().connected
        Object.entries(clientList).forEach(element => {
            let pseudo = element[1].pseudo;
            let id = element[1].id;
            userList.push({'id': id, 'pseudo': pseudo})
        });
        io.emit('generateList', userList)
    }
});

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/views/index.html');
});

http.listen(9999, () => {
    console.log('Server is up and running on http://localhost:9999');
});