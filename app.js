var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000)); // process.env.PORT for Heroku
app.use('/', express.static('public'));
app.get('*', function(req, res) {
    res.redirect(302, '/ipcalc.html');
});

var server = app.listen(app.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Start app at http://%s:%s", host, port);
});
