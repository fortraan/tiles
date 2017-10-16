var text = [
	"this",
	"is",
	["a", 1],
	"test"
];
var tiles = [];

var cdiv = $("#cd");

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function populate() {
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
	populate();
	for (var i = 0; i < tiles.length; i++) {
		var newTile = $("<div class=tile></div>").text(tiles[i].text);
		newTile.dragon({noCursor:true, dragStart:this.beginMove, drag:this.follow, dragEnd:this.snap});
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
		newTile.dblclick(this.breakApart);
		tiles[i].tile = newTile;
		cdiv.append(newTile);
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
	if ($(evt.target).children() != null) {
		$("#cd").append($(evt.target).children()[0].detach());
	}
}

function beginMove(evt) {
	
}

function follow(evt) {
	var tile = $(evt.target);
	var offset = tile.offset();
	console.log(offset);
	//findTile(tile).x = tile.offset().left;
	//findTile(tile).y = tile.offset().top;
	if (tile.parentsUntil("#cd").length > 0) {
		console.log("Walking parent tree");
		// Walk through the parent tree
		console.log(tile.parentsUntil("#cd"));
		var par = $(tile.parentsUntil("#cd")[0]);
		par.offset({top:par.offset().top + tile.position().top, left:tile.offset().left - (par.width() + 10)});
		//tile.position({top:0, left:par.width() + 20});
	}
}

function snap(evt) {
	var target = $(evt.target);
	for (var i = 0; i < tiles.length; i++) {
		var tile = tiles[i];
		if (!$.contains(target.get(0), tile.tile.get(0))) {
			if (tile.tile.get(0) !== target.get(0)) {
				var offset = tile.tile.offset();
				var yD = Math.abs(offset.top - target.offset().top);
				var lXD = Math.abs((offset.left + tile.tile.width()) - target.offset().left);
				var rXD = Math.abs(offset.left - (target.offset().left + target.width()));
				console.log("Yd = " + yD + " Lxd = " + lXD + " Rxd = " + rXD);
				if (yD < 10 && (lXD < 20 || rXD < 20)) {
					var detached = target.detach();
					//tile.tile.offset({top:tile.tile.offset().top + detached.position().top, left:detached.offset().left - (tile.tile.width() + 10)});
					$(tile.tile).append($(detached));
					$(detached).offset({top:$(tile.tile).offset().top, left:$(tile.tile).offset().left + $(tile.tile).width() + 10});
					console.log("Object snapped");
					//detached.get(0).offset({top:tile.tile.offset().top, left:tile.tile.width()});
				}
			}
		}
	}
}

init();