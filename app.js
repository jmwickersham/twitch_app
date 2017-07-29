let express = require('express');
let app = express();
let Twitch = require('./twitch.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/follower_count', function(request, response) {
  let followers = 5;

  response.render('pages/follower_count', {
    followers: followers
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port ', app.get('port'));
});
