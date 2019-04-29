
// code to read and set any environment variables with the dotenv package
require("dotenv").config();

// code required to import the `keys.js` file and store it in a variable
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var dataStr = process.argv;
// Global variables in use
var action = dataStr[2];
// split and join input to isolate all info after action
var input = dataStr.slice(3);
var result = "";

function appendText() {
  fs.appendFile("log.txt", '\n' + result, function(err) {

    // If an error was experienced we will log it.
    if (err) {
      console.log(err);
    }
  
    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
    else {
      console.log("Content Added!");
    }
  
  });
}

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
result = '\n' + "Song name: " + input + '\n' + "Artist: " + artist + '\n' + "Album: " + album + '\n' + "Link: " + info.preview_url;
console.log(result);
appendText(result);

});

}

function findConcert() {
    var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response) {
            var info = response.data[0];
            result = '\n' + "Venue name: "+ info.venue.name + '\n' + "Venue location: "
            + info.venue.city + ", " + info.venue.country + '\n' + 
            "Date: " + moment(info.datetime).format("MM DD YYYY")
        //    console.log(result.venue );
           console.log(result);
           appendText(result);
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
           var info = response.data;
          result =  '\n' + "Title: " + info.Title + '\n' + "The movie was released: " + info.Year + '\n' + "IMDB Rating: " + info.imdbRating + '\n' + "Rotten Tomato Rating: " + info.Ratings[1].Value + '\n' + "Country Produced: " + info.Country + '\n' + "Language: " + info.Language + '\n' + "Plot: " + '\n' + "  " + info.Plot + '\n' + "Actors: " + info.Actors
          console.log(result);
          appendText(result);
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