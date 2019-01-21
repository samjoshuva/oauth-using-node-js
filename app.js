var http = require('http');
var express = require('express');
var Session = require('express-session');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
const ClientId = "180418734625-c4tl2gqfl4r3ve0dscloepuadsr5vh49.apps.googleusercontent.com";
const RedirectionUrl = "http://localhost:3000/oauthCallback";
const ClientSecret = "vAta1bDee6H26OEoj0nfuHqe";

//starting the express app
var app = express();

//using session in express
app.use(Session({
    secret: '19890913007',
    resave: true,
    saveUninitialized: true
}));

//this is the base route
app.use("/", function (req, res) {
    var url = getAuthUrl();
    res.send(`
        <h1>Authentication using google oAuth</h1>
        <a href=${url}>Login</>
    `)
});


var port = 3000;
var server = http.createServer(app);
server.listen(port);
server.on('listening', function () {
    console.log(`listening to ${port}`);
});


function getOAuthClient () {
    return new OAuth2(ClientId ,  ClientSecret, RedirectionUrl);
}

function getAuthUrl () {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
      'https://www.googleapis.com/auth/plus.me'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });

    return url;
}



app.use("/oauthCallback", function (req, res) {
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code; // the query param code
    oauth2Client.getToken(code, function(err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.

      if(!err) {
        oauth2Client.setCredentials(tokens);
        //saving the token to current session
        session["tokens"]=tokens;
        res.send(`
            <h3>;Login successful!!</h3>
            <a href="/details">Go to details page</a>
        `);
      }
      else{
        res.send(`
            <h3>Login failed!!</h3>
        `);
      }
    });
});


