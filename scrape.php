<!-- Author - Michael Dombrowski aka coding guru -->

<?php

$username = "shivtools";
$password = "WME7169";

$connection = mysqli_connect('localhost', $username, $password, 'food'); //connection to mySQL database

$file = file_get_contents("http://dining.richmond.edu/locations/heilman/index.html");
$file = substr($file, strpos($file, "var locationmenu =")+strlen("var locationmenu ="));
$file = substr($file, 0, strpos($file, "</script>")-1);
$menu = json_decode($file, true);

//print_r($menu);

?>

<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"></link>
        <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="https://code.jquery.com/jquery-2.2.0.min.js"></script>

	</head>
	<body>
		<div class="container-fluid">
		<div class="col-md-12" id="main">
		</div>
		</div>

		<script type="text/javascript">

		var menu = "<?php echo addslashes($file);?>"; 

		menu = $.parseJSON(menu);
		menu = menu.results.location;
		console.log(menu);
		var rows = 0;
		$.each(menu, function(i,v){
			$.each(v.day, function(a,b){
				var toPrint = "<div class=\"col-md-3\"><h2>"+b["@attributes"].locname+": "+b["@attributes"].dow+"</h2>";
				if(b.meal.item != undefined){
					toPrint = toPrint+"<h4>"+b.meal["@attributes"].name+"</h4>";
					if($.isArray(b.meal.item)){
						$.each(b.meal.item, function(e,f){
							toPrint = toPrint + "<p>"+f+"</p>";
						});
					}
					else{
						toPrint = toPrint + "<p>"+b.meal.item+"</p>";
					}
				}
				else{
					$.each(b.meal, function(c, d){
						toPrint = toPrint+"<h4>"+d["@attributes"].name+"</h4>";
						if($.isArray(d.item)){
							$.each(d.item, function(e,f){
								toPrint = toPrint + "<p>"+f+"</p>";
							});
						}
						else{
							toPrint = toPrint + "<p>"+d.item+"</p>";
						}
					});
				}
				$("#main").append(toPrint+"</div>");
				rows++;
			});
		});
	</script>
	</body>
</html>