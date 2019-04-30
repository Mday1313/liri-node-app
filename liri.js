
// code to read and set any environment variables with the dotenv package
require("dotenv").config();

// ------------------------------Require NPMs-----------------------------------------
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// -------------------------------Global variables in use-----------------------------
var dataStr = process.argv;
var action = dataStr[2];
// split and join input to isolate all info after action
var input = dataStr.slice(3).join(" ");
// Set globally, changed and reassigned locally
var result = "";

// ----------------------------------Main Functions----------------------------------
// Adds info to log.txt
function appendText() {
  var cleanAppend = '\n' + input +'\n' + result + '\n' + "------------------------------------------------------------";
  fs.appendFile("log.txt", cleanAppend, function (err) {

    if (err) {
      console.log(err);
    } 
  });
}

// Read text from random.txt plug into appropiate function through a switch statement
function readRandom() {
  fs.readFile("random.txt", "utf8", function (error, data) {

    if (error) {
      return console.log(error);
    }
    // Feed info from random into global function for main switch
    var dataArr = data.split(",");
    action = dataArr[0];
    input = dataArr[1];

    mainSwitch(input);
  });
}
// Spotify function
function giveMeMusic() {
  // access your keys information
  var spotify = new Spotify(keys.spotify);
  // Default search if no search entered
  var searchAmt = 10;
  if (input == "") {
    input = "The Sign, Ace of Base";
    // Only display first result
    searchAmt = 1;
  }
  // GET info
  spotify.search({ type: 'track', query: input }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var info = data.tracks.items;
    // console.log(info);
   
    // Record info for 10 results
    for (var i = 0; i < searchAmt; i++) {
      console.log('\n' + parseInt(i + 1));

      
      result = '\n' + "Song name: " + info[i].name + '\n' + "Artist: " + info[i].artists[0].name + '\n' + "Album: " + info[i].album.name + '\n' + "Link: " + info[i].preview_url;
      console.log(result);
      console.log("------------------");
      appendText(result);
    }
  });
}
// Bands-in-Town Function
function findConcert() {
  if (input == "") {
    input = "Tool";
  }
  var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
  axios.get(queryUrl).then(
    function (response) {
      console.log("\nUpcoming shows for " + input);
      var info = response.data;
      
      // loop through first 10 shows
      for (var i = 0; i < 10; i++) {
        console.log('\n' + parseInt(i + 1));
        result = "Venue name: " + info[i].venue.name + '\n' + "Venue location: "
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
    function (response) {
      var info = response.data;
      result = '\n' + "Title: " + info.Title + '\n' + "The movie was released: " + info.Year + '\n' + "IMDB Rating: " + info.imdbRating + '\n' + "Rotten Tomato Rating: " + info.Ratings[1].Value + '\n' + "Country Produced: " + info.Country + '\n' + "Language: " + info.Language + '\n' + "Plot: " + '\n' + "  " + info.Plot + '\n' + "Actors: " + info.Actors
      console.log(result);
      appendText(result);
    }
  );
}
// Determines which function is called based on input
function mainSwitch(){

switch (action) {
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
  console.log("I don't know what you want from me!");
}
}

mainSwitch();