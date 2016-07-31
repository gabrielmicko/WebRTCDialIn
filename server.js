var express = require('express');
var app = express();

app.use('/public', express.static('public'));


app.get('*', function(req, resp) {
	resp.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
