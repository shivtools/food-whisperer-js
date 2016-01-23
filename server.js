var express = require('express');
var fs = require('fs');
var request = require('request');
var $ = require('jquery');

var router = express.Router();

var app = express();

app.get('/scrape', function(req, res){

  url = 'http://dining.richmond.edu/locations/heilman/index.html';

  request(url, function(error, response, html){

      if(!error){

            res.writeHead(200, {'Content-Type': 'text/html'});
            
            res.write('<html><head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"></link>
            <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
            </head>
            <body>
            <div class="container-fluid">
            <div class="col-md-12" id="main">');

            var file = html.substring(html.indexOf("var locationmenu =") + ("var locationmenu =").length); //in html finds 'var locationmenu = 
            file = file.substring(0, file.indexOf("</script>")-1); //get json data till end of last script tag

            var menu = JSON.parse(file); //parse JSON

            menu = menu.results.location; 

            console.log(menu);

            var rows = 0;
            menu.forEach(function(v){

              v.day.forEach(function(b){

                var toPrint = "<div class=\"col-md-3\"><h2>"+b["@attributes"].locname+": "+b["@attributes"].dow+"</h2>";

                if(b.meal.item != undefined){

                  toPrint = toPrint+"<h4>"+b.meal["@attributes"].name+"</h4>";

                  if(Array.isArray(b.meal.item)){

                    b.meal.item.forEach(function(f){
                      toPrint = toPrint + "<p>"+f+"</p>";
                    });

                  }
                  else{
                    toPrint = toPrint + "<p>"+b.meal.item+"</p>";
                  }
                }
                else{
                  b.meal.each(function(d){

                    toPrint = toPrint+"<h4>"+d["@attributes"].name+"</h4>";

                    if(Array.isArray(d.item)){

                      //if array of items, then print each item.
                      d.item.forEach(function(f){
                        toPrint = toPrint + "<p>"+f+"</p>";
                      });
                    }

                    //else print single item.
                    else{
                      toPrint = toPrint + "<p>"+d.item+"</p>";
                    }
                  });
                }
                //$("#main").append(toPrint+"</div>");
                res.send(toPrint + "</div>");
                rows++;
              });
            });

            //div containing all days of the week
            $daySpan = $('#dow-controls');
      }

      else{
            console.log("Could not fetch data");
      }

    // Finally, send end tags of html.
      res.write('</div></div></body></html>');

    });
})

// Has to be configured properly..

router.get('/fetch', function(req,res){
      res.render('index.html');
});

app.listen('8081'); console.log('Magic happens on port 8081');

exports = module.exports = app;