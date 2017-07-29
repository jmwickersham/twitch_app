require('dotenv').config();
const Promise = require('promise');
const express = require('express');
const app = express();
const TwitchAPI = require('./twitch.js');
const config = require('./config.json');

let channel = '';

let twitch = new TwitchAPI({
  clientId: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  redirectUri: config.twitch_redirectUri,
  scopes: ['channel_read']
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/follower_count', function(request, response, next) {
  twitch.getAuthenticatedUserChannel(process.env.TWITCH_AUTH)
    .then(fulfilled => {
      channel = JSON.parse(fulfilled);
      console.log('channel: ' + channel.followers);
      let followers = channel.followers;

      response.render('pages/follower_count', {
        followers: followers
      });
    })
    .catch(error => {
      console.log('promise error: ' + error.message);
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port ', app.get('port'));
});
