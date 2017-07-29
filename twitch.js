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

// Twitch.prototype.getAuthenticatedUserChannel = function(accessToken, callback) {
//   let options = {
//     url: baseUrl + '/channel',
//     method: 'GET',
//     headers: {
//       'Authorization': accessToken,
//       'Client-ID': this.clientId,
//       'Accept': 'application/vnd.twitchtv.v5+json'
//     }
//   };
//
//   request(options, function(error, response, body) {
//     if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
//       var bodyobj = JSON.parse(body);
//       console.log('body: ' + typeof bodyobj + ' / ' + bodyobj.followers);
//       return bodyobj;
//     }
//     else {
//       console.log(error);
//     }
//   })
// };

// Slack User Info Promise
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
                } else {
                    return resolve(response.body);
                }
            });
    });
}

module.exports = Twitch;
