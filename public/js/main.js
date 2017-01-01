$(function(){
	var w = $('#canvas-an').width(),
		h = $('#canvas-an').height();
	var paper = Raphael('canvas-an', 1000, 600);
	console.log(anData);
	// Creates circle at x = 50, y = 40, with radius 10
	var buf;
	_.forEach(anData, function(value, key){
		anData[key].display = {
			circle: paper.circle(value[0], value[1], 10),
			text: paper.text(value[0], value[1],key)
		}
		anData[key].display.value = 0;
		anData[key].display.circle.attr("fill", "#ef5350");
		anData[key].display.circle.attr("stroke", "#fff");
		anData[key].display.circle.attr("cursor", "move");
		anData[key].display.circle.drag(move, start, up);
	})
	_.forEach(micData, function(value, key){
		micData[key].display = {
			rect: paper.rect(value[0], value[1], 10,10),
			// text: paper.text(value[0], value[1],key)
		}
		micData[key].display.value = 0;
		micData[key].display.rect.attr("fill", "#8e24aa");
		micData[key].display.rect.attr("stroke", "#fff");
	})
	anData.ready = true;
})

var refresh = function() {
	_.forEach(anData, function(value, key){
		if(!anData[key].display){
			console.log("no display", key);
			return;
		}
		var val = anData[key].display.value;
		var color = (val < 0.5) ? "#ef5350" : "#9ccc65";
		color = (val < 0) ? "#ccc" : color;
		anData[key].display.circle.attr("fill", color);
		anData[key].display.circle.attr("stroke", "#fff");
		anData[key].display.circle.attr("cursor", "move");
		anData[key].display.circle.drag(move, start, up);
	})
}

var start = function () {
    // storing original coordinates
    this.ox = this.attr("cx");
    this.oy = this.attr("cy");
    this.attr({opacity: 1});
}
var move = function (dx, dy) {
    // move will be called with dx and dy
    this.attr({cx: this.ox + dx, cy: this.oy + dy}); 
}
var up = function () {
	_.forEach(anData, function(value, key){
		// console.log("key", key);
		// console.log("anData key",anData[key]);
		if (anData[key].display) {
			anData[key].display.text.attr({
				x: anData[key].display.circle.attrs.cx, 
				y: anData[key].display.circle.attrs.cy 
			});
			anData[key][0] = anData[key].display.circle.attrs.cx
			anData[key][1] = anData[key].display.circle.attrs.cy
		}
	})              
};   

	var plusX = function(){
		var key = $("#key").val();
		console.log("key", key);
		console.log("anData key",anData[key]);
		anData[key].display.circle.attr({
			cx: anData[key].display.circle.attrs.cx + 1, 
			cy: anData[key].display.circle.attrs.cy, 
			fill: "#ef5350", stroke: "#FFF"});
		anData[key].display.text.attr({
			x: anData[key].display.circle.attrs.cx, 
			y: anData[key].display.circle.attrs.cy 
		});
		anData[key][0] = anData[key].display.circle.attrs.cx
		anData[key][1] = anData[key].display.circle.attrs.cy
		console.log(anData);
	}
	var moinsX = function(){
		var key = $("#key").val();
		console.log("key", key);
		console.log("anData key",anData[key]);
		anData[key].display.circle.attr({
			cx: anData[key].display.circle.attrs.cx - 1, 
			cy: anData[key].display.circle.attrs.cy, 
			fill: "#ef5350", stroke: "#FFF"});
		anData[key].display.text.attr({
			x: anData[key].display.circle.attrs.cx, 
			y: anData[key].display.circle.attrs.cy 
		});
		anData[key][0] = anData[key].display.circle.attrs.cx
		anData[key][1] = anData[key].display.circle.attrs.cy
		console.log(anData);
	}
	var plusY = function(){
		var key = $("#key").val();
		console.log("key", key);
		console.log("anData key",anData[key]);
		anData[key].display.circle.attr({
			cx: anData[key].display.circle.attrs.cx, 
			cy: anData[key].display.circle.attrs.cy + 1, 
			fill: "#ef5350", stroke: "#FFF"});
		anData[key].display.text.attr({
			x: anData[key].display.circle.attrs.cx, 
			y: anData[key].display.circle.attrs.cy 
		});
		anData[key][0] = anData[key].display.circle.attrs.cx
		anData[key][1] = anData[key].display.circle.attrs.cy
		console.log(anData);
	}
	var moinsY = function(){
		var key = $("#key").val();
		console.log("key", key);
		console.log("anData key",anData[key]);
		anData[key].display.circle.attr({
			cx: anData[key].display.circle.attrs.cx, 
			cy: anData[key].display.circle.attrs.cy - 1, 
			fill: "#ef5350", stroke: "#FFF"});
		anData[key].display.text.attr({
			x: anData[key].display.circle.attrs.cx, 
			y: anData[key].display.circle.attrs.cy 
		});
		anData[key][0] = anData[key].display.circle.attrs.cx
		anData[key][1] = anData[key].display.circle.attrs.cy
		console.log(anData);
	}
