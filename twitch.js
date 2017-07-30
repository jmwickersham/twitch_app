const request = require('request');
const config = require('./config.json');

let Twitch = function(options) {
  if (!(this instanceof Twitch)) {
    return new Twitch(options);
  }

  this.clientId = options.clientId;
  this.clientSecret = options.clientSecret;
  this.redirectUri = options.redirectUri;
  this.scopes = options.scopes || [];

  return this;
}

// Get Channel Deets
Twitch.prototype.getAuthenticatedUserChannel = function(accessToken) {
  return new Promise((resolve, reject) => {
    request({
        url: config.twitch_baseUrl + '/channel',
        method: 'GET',
        headers: {
          'Authorization': accessToken,
          'Client-ID': this.clientId,
          'Accept': 'application/vnd.twitchtv.v5+json'
        }
      },

      function(err, response, body) {
        if (err || response === undefined || response.statusCode !== 200) {
          let reason = new Error('Trouble connecting to Twitch API: ' + err);
          return reject(reason);
        }
        else {
          return resolve(response.body);
        }
      });
  });
}

// Get Channel Followers
Twitch.prototype.getChannelFollows = function(channel, parameters, callback){
  return new Promise((resolve, reject) => {
    request({
        url: config.twitch_baseUrl + '/channels/' + channel + '/follows',
        method: 'GET',
        headers: {
          'Client-ID': this.clientId,
          'Accept': 'application/vnd.twitchtv.v5+json'
        }
      },

      function(err, response, body) {
        if (err || response === undefined || response.statusCode !== 200) {
          let reason = new Error('Trouble connecting to Twitch API: ' + err);
          return reject(reason);
        }
        else {
          return resolve(response.body);
        }
      });
  });
}

module.exports = Twitch;
