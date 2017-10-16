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
		newTile.dragon({dragStart:this.beginMove, drag:this.follow, dragEnd:this.snap});
		newTile.offset({top:tiles[i].y, left:tiles[i].x});
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

function beginMove(evt) {
	console.log(evt.which);
}

function follow(evt) {
	var tile = $(evt.target);
	if (tile.parentsUntil("#cd").length > 0) {
		console.log("Walking parent tree");
		// Walk through the parent tree
		console.log(tile.parentsUntil("#cd"));
		var par = tile.parentsUntil("#cd")[0];
		par.offset({top:par.offset().top + tile.offset().top, left:par.offset().left + tile.offset().left});
		tile.offset({top:0, left:0});
	}
}

function snap(evt) {
	/*var target = $(evt.target);
	for (var tile in tiles) {
		if (!(tile.tile in target.children()) && $(tile.tile) != target) {
			var yD = Math.abs(tile.tile.offset().top - target.offset().top);
			var lXD = Math.abs(tile.tile.offset().right - target.offset().left);
			var rXD = Math.abs(tile.tile.offset().left - target.offset().right);
			if (yD < 10 && (lXD < 10 || rXD < 10)) {
				var detached = target.detach();
				$(tile.tile).append(detached);
			}
		}
	}*/
}

init();