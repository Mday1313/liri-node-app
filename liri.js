
// code to read and set any environment variables with the dotenv package
require("dotenv").config();

// code required to import the `keys.js` file and store it in a variable
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");

var dataStr = process.argv;
// Global variables in use
var action = dataStr[2];
// split and join input to isolate all info after action
var input = dataStr.slice(3);



function giveMeMusic() {
// access your keys information
var spotify = new Spotify(keys.spotify);

if (input == "") {
    input = "The Sign, Ace of Base";
}
spotify.search({ type: 'track', query: input }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
var info = data.tracks.items[0];
var album = info.album.name;
var artist = info.artists[0].name;
console.log('\n' + "Song name: " + input + '\n' + "Artist: " + artist + '\n' + "Album: " + album + '\n' + "Link: " + info.preview_url);


});
}

function findConcert() {
    var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response) {
            var result = response.data[0];
        //    console.log(result.venue );
           console.log('\n' + "Venue name: "+ result.venue.name + '\n' + "Venue location: "
             + result.venue.city + ", " + result.venue.country + '\n' + 
             "Date: " + moment(result.datetime).format("MM DD YYYY"));
             
        }
      );
}

function entertainMe() {
    if (input == "") {
        input = "Mr. Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function(response) {
           var result = response.data;

          console.log( '\n' + "Title: " + result.Title + '\n' + "The movie was released: " + result.Year + '\n' + "IMDB Rating: " + result.imdbRating + '\n' + "Rotten Tomato Rating: " + result.Ratings[1].Value + '\n' + "Country Produced: " + result.Country + '\n' + "Language: " + result.Language + '\n' + "Plot: " + '\n' + "  " + result.Plot + '\n' + "Actors: " + result.Actors);
        }
      );
}

switch(action) {
    case "spotify-this-song":
    giveMeMusic();
      break;
    case "concert-this":
      findConcert();
      break;
      case "movie-this":
      entertainMe();
      break;
      case "do-what-it-says":
      // code block
      break;
    default:
      // code block
  }