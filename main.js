var version = "beta-0.5";

var textInit = [
	//// Determiners ////
	// Definite
	/*['the', 5]
	["this", 5],
	["that", 5],
	["these", 5],
	["those", 5],
	["my", 5],
	//["your", 5],
	["his", 5],
	//["hers", 5],
	//["its", 5],
	["our", 5],
	["their", 5],
	["whose", 5],
	["which", 5],
	["what", 5],
	// Indefinite
	["a", 5],
	["an", 5],
	["some", 5],
	["any", 5],
	// Quantifiers
	["much", 5],
	["many", 5],
	["little", 5],
	["few", 5],
	["more", 5],
	["most", 5],
	["less", 5],
	["fewer", 5],
	["least", 5],
	["fewest", 5],
	["0", 5],
	["1", 5],
	["2", 5],
	["3", 5],
	["4", 5],
	["5", 5],
	["6", 5],
	["7", 5],
	["8", 5],
	["9", 5],
	["10", 5],
	["all", 5],
	["both", 5],
	["none", 5],
	["each", 5],
	["every", 5],
	// Personal
	["we", 5],
	["us", 5],
	//// Nouns ////
	["i", 5],
	["me", 5],
	["you", 5],
	["he", 5],
	["she", 5],
	["it", 5],
	
	["s", 10],
	["r", 5]*/
	
	"hello",
	"world",
	"welcome",
	"to",
	"tiles"
];
var text = [];
var tiles = [];

var doSnap = false;
var cahModeActivated = false;
var splashShown = true;
var textOpen = false;
var options = [];
var optionVals = {};

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function populate() {
	populateJ(JSON.stringify(textInit));
}

function populateJ(json) {
	tiles = [];
	$("#cd").empty();
	text = JSON.parse(json);
	for (var i = 0; i < text.length; i++) {
		if (Array.isArray(text[i])) {
			for (var r = 0; r < text[i][1]; r++) {
				tiles.push(
				{
					text:text[i][0],
					x:randomIntFromInterval(0, $(window).width()),
					y:randomIntFromInterval(0, $(window).height()),
					tile:null
				});
			}
		} else {
			var x = randomIntFromInterval(0, $(window).width()), y = randomIntFromInterval(0, $(window).height());
			tiles.push(
			{
				text:text[i],
				x:x,
				y:y,
				tile:null
			});
			console.log("x: " + x + " y: " + y);
		}
		
	}
}

function init() {
	$("#versiontag").html("<span id=\"vt\">t</span>iles " + version);
	$("#splash div").hover(function (event) {
		$("#splash div div").animate({width:"80px"}, 400);
	}, function (event) {
		$("#splash div div").animate({width:"0px"}, 400);
	});
	$("#splash div").click(function (event) {
		$("#splash").fadeOut(500);
		$(".tile.dragon").fadeIn(500);
		splashShown = false;
	});
	$("#snap").click(function (event) {
		console.log("Snap");
		doSnap = !doSnap;
		if (doSnap) {
			$("#snap").css("background-color", "#ffffff");
		} else {
			$("#snap").css("background-color", "rgba(0, 0, 0, 0)");
		}
	});
	/*$("#cah").click(function (event) {
		console.log("cah");
		cahModeActivated = !cahModeActivated;
		if (cahModeActivated) {
			$("#cah").css("background-color", "#ffffff");
		} else {
			$("#cah").css("background-color", "rgba(0, 0, 0, 0)");
		}
	});*/
	$("body").keydown(function (event) {
		console.log(event.which);
		if (event.which === 87 && !splashShown) {
			textOpen = !textOpen;
			if (textOpen) {
				$("#text-input").animate({left:"7px"}, 280, function () {
					// It's the little details that make it look nice.
					$("#text-input").animate({left:"2px"}, 50);
				});
			} else {
				$("#text-input").animate({left:"7px"}, 100, function () {
					$("#text-input").animate({left:"-260px"}, 260);
				});
			}
		}
	});
	$("#text-input div").click(loadFromText);
	$("#textjson").val(JSON.stringify(textInit, null, 4));
	// Borrowing some code from https://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
	$("#textjson").keydown(function (e) {
    	if (e.keyCode === 9) {
	        var start = this.selectionStart;
	        var end = this.selectionEnd;
	        var $this = $(this);
	        var value = $this.val();
	        $this.val(value.substring(0, start) + "\t" + value.substring(end));
	        this.selectionStart = this.selectionEnd = start + 1;
    	    e.preventDefault();
    	}
	});
	populate();
	for (var i = 0; i < tiles.length; i++) {
		var newTile = $("<div class=tile></div>").text(tiles[i].text);
		newTile.dragon({noCursor:true, dragStart:breakApart, dragEnd:snap});
		newTile.offset({top:tiles[i].y, left:tiles[i].x});
		newTile.hover(function (evt) {
			console.log("Mouse over");
			$(evt.target).css("background-color", "#eeeeee");
			$(evt.target).css("box-shadow", "0px 0px 0px 10px #eeeeee");
		}, function (evt) {
			$(evt.target).css("background-color", "#ffffff");
			$(evt.target).css("box-shadow", "0px 0px 0px 10px #ffffff");
		});
		newTile.hide();
		//newTile.addEventListener("click", this.beginMove, false);
		//newTile.addEventListener("contextmenu", this.beginMove, false);
		tiles[i].tile = newTile;
		$("#cd").append(newTile);
	}
}

function createOptions() {
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		var optionHtml = $("<div class=\"option\" id=\"" + option.v + "\"><p>" + option.displayName + "</p></div>")
			.click(function (event) {
				optionVals[$(event.target).attr("id")] = !optionVals[$(event.target).attr("id")];
				if (optionVals[$(event.target).attr("id")]) {
					$(event.target).css("background-color", "#ffffff");
				} else {
					$(event.target).css("background-color", "rgba(0, 0, 0, 0)");
				}
			})
			.css({"left":"10px", "bottom":String((i * 20) + 10) + "px"});
	}
}

function loadFromText(event) {
	var inputjson = $("#textjson").val();
	$("#text-input").animate({left:"7px"}, 100, function () {
		$("#text-input").animate({left:"-260px"}, 260);
	});
	populateJ(inputjson);
	for (var i = 0; i < tiles.length; i++) {
		var newTile = $("<div class=tile></div>").text(tiles[i].text);
		newTile.dragon({noCursor:true, dragStart:breakApart, drag:follow, dragEnd:snap});
		newTile.offset({top:tiles[i].y, left:tiles[i].x});
		newTile.hover(function (evt) {
			console.log("Mouse over");
			$(evt.target).css("background-color", "#eeeeee");
			$(evt.target).css("box-shadow", "0px 0px 0px 10px #eeeeee");
		}, function (evt) {
			$(evt.target).css("background-color", "#ffffff");
			$(evt.target).css("box-shadow", "0px 0px 0px 10px #ffffff");
		});
		//newTile.addEventListener("click", this.beginMove, false);
		//newTile.addEventListener("contextmenu", this.beginMove, false);
		tiles[i].tile = newTile;
		$("#cd").append(newTile);
	}
}

function findTile(htmlTile) {
	var objTile = null;
	tiles.forEach(function (tile) {
		if (tile.tile == htmlTile) {
			objTile = tile;
		}
	});
	return objTile;
}

function breakApart(evt) {
	if (doSnap) {
		console.log("Break");
		if ($(evt.target).parentsUntil("#cd").length > 0) {
			$("#cd").append($(evt.target).detach());
		}
	}
}

/*function follow(evt) {
	if (!doSnap) return;
	var tile = $(evt.target);
	var offset = tile.offset();
	console.log(offset);
	if (tile.parentsUntil("#cd").length > 0) {
		console.log("Walking parent tree");
		// Walk through the parent tree
		console.log(tile.parentsUntil("#cd"));
		var par = $(tile.parentsUntil("#cd")[0]);
		for (var i = tile.parentsUntil("#cd").length - 1; i > -1; i--) {
			tile.parentsUntil("#cd")[i].offset({top:tile.parentsUntil("#cd")[i].offset().top + tile.position().top, left:tile.offset().left - (tile.parentsUntil("#cd")[i].width() + 10)});
		}
	}
}*/

function snap(evt) {
	if (!doSnap) return;
	console.log("snapping");
	var target = $(evt.target);
	for (var i = 0; i < tiles.length; i++) {
		var tile = tiles[i];
		if (!$.contains(target.get(0), tile.tile.get(0))) {
			if (tile.tile.get(0) !== target.get(0)) {
				var offset = tile.tile.offset();
				var yD = Math.abs(offset.top - target.offset().top);
				var rxc = $(target);
				var lxc = $(target);
				if ($(target).children().length > 0) {
					rxc = $(target).children()[$(target).children().length - 1];
				}
				if ($(target).parentsUntil("#cd").length > 0) {
					lxc = $(target).parentsUntil("#cd")[0];
				}
				var lXD = Math.abs((offset.left + tile.tile.width()) - $(lxc).offset().left);
				var rXD = Math.abs(offset.left - ($(rxc).offset().left + $(rxc).width()));
				console.log("Yd = " + yD + " Lxd = " + lXD + " Rxd = " + rXD);
				if (yD < 10) {
					var detached;
					console.log(String($(tile.tile).width()));
					if (lXD < 20) {
						detached = lxc.detach();
						$(tile.tile).append($(detached));
						$(detached).css({left:String($(tile.tile).width() + 10) + "px", top:"0px"});
					}
					if (rXD < 20) {
						detached = tile.tile.detach();
						$(rxc).append($(detached));
						$(detached).css({left:String($(rxc).width() + 10) + "px", top:"0px"});
					}
					
					console.log("Object snapped");
				}
			}
		}
	}
}

$(this.init);