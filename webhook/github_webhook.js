var config = require('./config.json')
var http = require('http')
var exec = require('child_process').exec
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: config.path, secret: config.secret})

http.createServer(function (req, res) {
handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(config.port)

handler.on('push', function (event) {
    let currentTime = new Date();
    console.log('\n--> ' + currentTime.toLocaleString());
    console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref);
    exec('sh ./git_pull_build.sh', function (error, stdout, stderr) {
        if(error) {
            console.error('error:\n' + error);
            return;
        }
        console.log('stdout:\n' + stdout);
        console.log('stderr:\n' + stderr);
    });
})
