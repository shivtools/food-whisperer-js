
		$("body").ready(function(){
			if((typeof(isMobile) != "undefined") && (isMobile == true)){
				//shorten the day labels:
				$("#dow-controls span").each(function(){
					var t = $(this).text();
					$(this).text(t.substring(0,2));
				});
			}
			
			
			$("#dow-controls span").click(function(){
				$(".meal .sorry").remove();
				$(this).siblings().removeClass("on");
				$(this).addClass("on");

				//find the JSON object for today in all locations and render them.
				var newDay = $(this).attr("day");
				for(var loc=0; loc<locationmenu.results.location.length; loc++){
					$(".meal:eq("+loc+") .section .item").remove();	//empty the old items
					$(".meal .section").hide(); //hide sections; will bring back non-empty sections
					
					for(d in locationmenu.results.location[loc].day){ //traverse to the new items
					
					
						if( (locationmenu.results.location[loc].day[d]["@attributes"].dow == newDay) || 
						    (locationmenu.results.location[loc].day[d]["@attributes"].dow == "") //also need to add core items.
						  ){
							var meals = locationmenu.results.location[loc].day[d].meal; //meals may be single or multiple, so standardize to an array
							if(!($.isArray(meals))){
								meals = [];
								meals.push(locationmenu.results.location[loc].day[d].meal);
								console.log(locationmenu.results.location[loc].day[d].meal);
							}
							
							for(m in meals){
								//get the matching section for the current meal:
								var section = $(".meal:eq("+loc+") .section").filter(function(){
									return $(this).children(".section-title").text() == meals[m]["@attributes"].name;
								});
								
								//if section is empty, make a new one:
								if(section.length == 0){
									$(".meal:eq("+loc+") .content").append("<div class=\"section\"><div class=\"section-title\">"+meals[m]["@attributes"].name+"</div><div class=\"clear\"></div></div>");
									section = $(".meal:eq("+loc+") .section:last");
								}
							
								//only fill blocks if status == Available
								if( (typeof(meals[m]["@attributes"].status) == "undefined") ||
								    (meals[m]["@attributes"].status == "Available") 
								  ) {
									var items = meals[m].item; //items may be single or multiple, so standardize to an array
									if(!($.isArray(items))){
										items = [];
										items.push(meals[m].item);
									}
										
									for(i in items){								
										section.children(":last").before("<div class=\"item short\"><span class=\"title\">"+items[i]+"</span></div>");
									}
								}
								else {
									section.empty();
								}
							}
						}
					}
				}
				
				
				//check that all meals at least have something visible:
				$(".meal").each(function(){
					if($(this).find(".section:has(.item)").length == 0){
						$(this).children(".content").append("<div class=\"section sorry hide\"><div class=\"item short\"><span class=\"title\">There are no items in "+$("#dining-menu-controls li:eq("+$(this).index()+")").text()+" today.</span></div><div class=\"clear\"></div></div>");
					}
				});
				
				$(".meal .section:has(.item)").fadeIn();
			});
		});

//location menu code


		