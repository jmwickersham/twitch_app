require('dotenv').config();
const Promise = require('promise');
const express = require('express');
const app = express();
const TwitchAPI = require('./twitch.js');
const config = require('./config.json');

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
      let channel = JSON.parse(fulfilled);
      console.log('channel: ' + channel.followers);
      let follower_count = channel.followers;

      response.render('pages/follower_count', {
        followers: follower_count
      });
    })
    .catch(error => {
      console.log('promise error: ' + error.message);
    });
});

app.get('/recent_followers', function(request, response, next) {
  twitch.getChannelFollows('42859398')
    .then(fulfilled => {
      let followers = JSON.parse(fulfilled);
      console.log('followers: ' + followers);

      let followerArray = [];
      for (i = 0; i < followers.follows.length; i++) {
        console.log(followers.follows[i].user.name);
        followerArray.push(followers.follows[i].user.name);
      }
      console.log(followerArray.toString());

      response.render('pages/recent_followers', {
        followerlist: followerArray.toString()
      });
    })
    .catch(error => {
      console.log('promise error: ' + error.message);
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port ', app.get('port'));
});
