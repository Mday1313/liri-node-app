
// code to read and set any environment variables with the dotenv package
require("dotenv").config();

// ------------------------------Require NPMs----------------------------------------------
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// -------------------------------Global variables in use-----------------------------------
var dataStr = process.argv;
var action = dataStr[2];
// split and join input to isolate all info after action
var input = dataStr.slice(3).join(" ");

var result = "";

// ----------------------------------Main Functions-----------------------------------------
// Adds info to log.txt
function appendText() {
  fs.appendFile("log.txt", '\n' + result + '\n' + "------------------------------------------------------------", function(err) {

    if (err) {
      console.log(err);
    } else {
     
    }
  });
}

// Read text from random.txt plug into appropiate function through a switch statement
function readRandom() {
  fs.readFile("random.txt", "utf8", function(error, data) {

    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");
    action = dataArr[0];
    input = dataArr[1];
    
    switch(action) {
      case "spotify-this-song":
      giveMeMusic(input);
        break;
      case "concert-this":
        findConcert(input);
        break;
      case "movie-this":
        entertainMe(input);
        break;
      default:
        console.log("I don't know what you want from me!");
        break;
    }
  });
}
// Spotify function
function giveMeMusic() {
// access your keys information
var spotify = new Spotify(keys.spotify);
// Default search if no search entered
if (input == "") {
    input = "The Sign, Ace of Base";
}
// GET info
spotify.search({ type: 'track', query: input }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }

var info = data.tracks.items;
// Record info for all 20 results
for (var i = 0; i < info.length; i++) {
  console.log(i);

var album = info[i].album.name;

var artist = info[i].artists[0].name;
result = '\n' + "Song name: " + info[i].name + '\n' + "Artist: " + artist + '\n' + "Album: " + album + '\n' + "Link: " + info[i].preview_url;
console.log(result);
console.log("------------------");
appendText();
}


});
}
// Bands-in-Town Function
function findConcert() {
    var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response) {
            
            var info = response.data;

            for (var i = 0; i < info.length; i++) {
              console.log(i);
            result = '\n' + "Venue name: "+ info[i].venue.name + '\n' + "Venue location: "
            + info[i].venue.city + ", " + info[i].venue.region + ", " + info[i].venue.country + '\n' + 
            "Date: " + moment(info[i].datetime).format("MM DD YYYY")
      
           console.log(result);
           console.log("------------------");
           appendText(result);
            }
        }
      );
}

// OMDB Function
function entertainMe() {
  // Default search if no search entered
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
// Determines which function is called based on input
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
      readRandom();
      break;
    default:
      // code block
  }