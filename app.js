var express = require('express'),
	bodyParser = require('body-parser'),
	OAuth2Server = require('oauth2-server'),
	Request = OAuth2Server.Request,
	Response = OAuth2Server.Response;
const path = require('path');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.oauth = new OAuth2Server({
	model: require('./model.js'),
	accessTokenLifetime: 60 * 60,
	allowBearerTokensInQueryString: true
});

app.all('/oauth/token', obtainToken);

app.get('/test', authenticateRequest, function (req, res) {

	res.send('Hello world!');
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/opendialogue', authenticateRequest, function (req, res) {

	res.send('Hello OD!');
});

// app.listen(3000);

app.listen(3000, function (err) {
	if (err) console.log("Error in server setup")
	console.log("Server listening on Port", 3000);
})
function obtainToken(req, res) {

	var request = new Request(req);
	var response = new Response(res);
	return app.oauth.token(request, response)
		.then(function (token) {

			res.json(token);
		}).catch(function (err) {


			res.status(err.code || 500).json(err);
		});
}

function authenticateRequest(req, res, next) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
		.then(function (token) {

			next();
		}).catch(function (err) {

			res.status(err.code || 500).json(err);
		});
}
