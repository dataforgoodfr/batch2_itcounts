$(function(){
	var paper = Raphael(0,30, 1000, 600);
	console.log(anData);
	// Creates circle at x = 50, y = 40, with radius 10
	var buf;
	_.forEach(anData, function(value, key){
		anData[key].display = {
			circle: paper.circle(value[0], value[1], 10),
			text: paper.text(value[0], value[1],key)
		}
		anData[key].display.circle.attr("fill", "#f00");
		anData[key].display.circle.attr("stroke", "#fff");
		anData[key].display.circle.attr("cursor", "move");
		anData[key].display.circle.drag(move, start, up);
	})
})

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
		anData[key].display.text.attr({
			x: anData[key].display.circle.attrs.cx, 
			y: anData[key].display.circle.attrs.cy 
		});
		anData[key][0] = anData[key].display.circle.attrs.cx
		anData[key][1] = anData[key].display.circle.attrs.cy
	})              
};   

	var plusX = function(){
		var key = $("#key").val();
		console.log("key", key);
		console.log("anData key",anData[key]);
		anData[key].display.circle.attr({
			cx: anData[key].display.circle.attrs.cx + 1, 
			cy: anData[key].display.circle.attrs.cy, 
			fill: "#F00", stroke: "#FFF"});
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
			fill: "#F00", stroke: "#FFF"});
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
			fill: "#F00", stroke: "#FFF"});
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
			fill: "#F00", stroke: "#FFF"});
		anData[key].display.text.attr({
			x: anData[key].display.circle.attrs.cx, 
			y: anData[key].display.circle.attrs.cy 
		});
		anData[key][0] = anData[key].display.circle.attrs.cx
		anData[key][1] = anData[key].display.circle.attrs.cy
		console.log(anData);
	}
