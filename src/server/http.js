let http = require('http');
let fs = require('fs');
let path = require('path');  

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
            res.writeHead(404);
            res.end();
            return;
        }
        res.writeHead(200);
        res.write(data);
        res.end();
    });

});

let portNumber = 8080;
server.listen(portNumber, function() {
    console.log('HTTP server start on port ' + portNumber);
});

module.exports = server;
