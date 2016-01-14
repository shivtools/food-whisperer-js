var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  url = 'http://dining.richmond.edu/locations/heilman/index.html';

  request(url, function(error, response, html){

      if(!error){
            var $ = cheerio.load(html);

            //div containing all days of the week
            $daySpan = $('.dow-controls');


            //iterate through every day and get all items on menu
            //store them in db (to be done)
            $('.dow-controls').filter(function(){
              var data_day = $(this);

              console.log(data_day); //needs work.
            })

            console.log($daySpan.children("span")); //get children for days of the week

            $('.title').filter(function(){
                var data = $(this);
                var item = data.text(); //get food items for given day.
                //console.log(item);
            });
      }

      else{
            console.log("Could not fetch data");
      }

  // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
      res.send('Check your console!')

    });
})

app.listen('8081'); console.log('Magic happens on port 8081'); exports = module.exports = app;