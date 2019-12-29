let http = require('http');
let fs = require('fs');
let path = require('path');   
let GameLogic = require('../core/gameLogic.js');
let Game = require('./game.js');

let server = http.createServer(function (req, res) {
    if (req.method !== "GET") {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("Not found");
        res.end();
        return;
    }

    let fileName = req.url == '/' ? '/index.html' : req.url;
    let filePath = path.join(__dirname, '../..' + fileName);
    fs.readFile(filePath, function (err, data) {
        if (err) {
            data = 'error';
            console.log(err);
        }
        res.writeHead(200);
        res.write(data);
        res.end();
    });

});

let waiting = {};
let game = null;
let io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log('new socket connection');

    socket.on('disconnect', function(){
        console.log('user disconnected');
        delete waiting[socket.id];
    });

    socket.on('grid select', function(data) {
        console.log('grid select');
        game && game.handleGridSelection(data.x, data.y, socket);
    });

    socket.on('ask new game', function(data) {
        if (typeof waiting[socket.id] === 'undefined') {
            waiting[socket.id] = playerFromSocket(socket);
        }
        
        console.log(Object.keys(waiting).length + ' players in queue');
        if (Object.keys(waiting).length > 1) {
            console.log('starting a game');
            startGame(waiting);
        }
        console.log(Object.keys(waiting).length + ' players in queue');
    });
});

function playerFromSocket(socket) {
    return {
        socket: socket
    }
}
function startGame(waitingList) {
    let players = [];
    for (let i of Object.keys(waitingList)) {
        players.push(waitingList[i]);
        delete waitingList[i];
    }

    let data = {};
    data.pawns = {};
    game = new Game();
    for (let p of players) {
        game.addPlayer(p);
    }
    
    game.startNewGame();

} 

let portNumber = 8080;
server.listen(portNumber, function() {
    console.log('HTTP server start on port ' + portNumber);
});
