var data = {};

$( document ).ready(function() {
    
    initDataviz(getRequest($('#to_visualize').val()));

    $('#to_visualize').on('change',function(){
        initDataviz(getRequest($('#to_visualize').val()));
    });

});

function getRequest(value){
  var request =''
  switch(value){
    case 'region':
      request = '/api/dataviz_bubble/groupBy/region-nom';
      break;
    case 'age':
      request = '/api/dataviz_bubble/age_range/5';
      break;
    case 'parti_politique':
    default:
      request = '/api/dataviz_bubble/groupBy/groupe-organisme';
      break;
  }
  return request;
}

function initDataviz(request){
  $.get(request, function(resp) {
          var groupesObj={};
          var id = 0;
          resp.forEach(function(value) {
            if(!(value._id.groupe in groupesObj)){
              groupesObj[value._id.groupe]={};
              ++id;
              groupesObj[value._id.groupe].id = id;
              groupesObj[value._id.groupe].name=value._id.groupe;
              groupesObj[value._id.groupe].count = 0;
              groupesObj[value._id.groupe].F = 0;
              groupesObj[value._id.groupe].H = 0;
            }
            groupesObj[value._id.groupe][value._id.sexe]+=value.count;
            groupesObj[value._id.groupe].count += value.count;
          });

          data.groupes = $.map(groupesObj, function(value, index) {
            return [value];
          });
          var width = 1050,
              height = 600;

          var collisionPadding = 4,
              clipPadding = 4,
              minRadius = 40, // minimum collision radius
              maxRadius = 70, // also determines collision search radius
                  activeTopic; // currently-displayed topic

          var formatShortCount = d3.format(",.0f"),
              formatLongCount = d3.format(".1f"),
              formatCount = function(d) { return (d < 10 ? formatLongCount : formatShortCount)(d); };

          var r = d3.scale.sqrt()
              .domain([0, d3.max(data.groupes, function(d) { return d.count; })])
              .range([0, maxRadius]);

          var force = d3.layout.force()
              .charge(20)
              .size([width, height - 100])
              .on("tick", tick);

          var node = d3.select(".g-nodes").selectAll(".g-node"),
              label = d3.select(".g-labels").selectAll(".g-label");

          d3.select(".g-nodes").append("rect")
              .attr("class", "g-overlay")
              .attr("width", width)
              .attr("height", height);
          
          updateTopics(data.groupes);
        




    // Update the known topics.
    function updateTopics(groupes) {
       $.each(groupes, function( index, d ) {
        d.r = r(d.count);
        d.cr = Math.max(minRadius, d.r);
        d.k = fraction(d.F, d.H);
        if (isNaN(d.k)) d.k = .5;
        d.cx = d.x =( 1- d.k) * width + Math.random();
        d.cy = d.y = d.H;
        d.bias = .3 - Math.max(.1, Math.min(.9, d.k));
      });
      force.nodes(data.groupes = groupes).start();
      updateNodes();
      updateLabels();
      tick({alpha: 0}); // synchronous update
    }

    // Update the displayed nodes.
    function updateNodes() {
      node = node.data(data.groupes, function(d) { return d.name; });

      node.exit().remove();

      var nodeEnter = node.enter().append("a")
          .attr("class", "g-node")
          .call(force.drag)
          .call(linkTopic);

      var femmeEnter = nodeEnter.append("g")
          .attr("class", "g-femme");

      femmeEnter.append("clipPath")
          .attr("id", function(d) { return "g-clip-femme-" + d.id; })
        .append("rect");

      femmeEnter.append("circle");

      var hommeEnter = nodeEnter.append("g")
          .attr("class", "g-homme");

      hommeEnter.append("clipPath")
          .attr("id", function(d) { return "g-clip-homme-" + d.id; })
        .append("rect");

      hommeEnter.append("circle");

      nodeEnter.append("line")
          .attr("class", "g-split");

      node.selectAll("rect")
          .attr("y", function(d) { return -d.r - clipPadding; })
          .attr("height", function(d) { return 2 * d.r + 2 * clipPadding; });

      node.select(".g-femme rect")
          .style("display", function(d) { return d.k > 0 ? null : "none" })
          .attr("x", function(d) { return -d.r - clipPadding; })
          .attr("width", function(d) { return 2 * d.r * d.k + clipPadding; });

      node.select(".g-homme rect")
          .style("display", function(d) { return d.k < 1 ? null : "none" })
          .attr("x", function(d) { return -d.r + 2 * d.r * d.k; })
          .attr("width", function(d) { return 2 * d.r; });

      node.select(".g-femme circle")
          .attr("clip-path", function(d) { return d.k < 1 ? "url(#g-clip-femme-" + d.id + ")" : null; });

      node.select(".g-homme circle")
          .attr("clip-path", function(d) { return d.k > 0 ? "url(#g-clip-homme-" + d.id + ")" : null; });

      node.select(".g-split")
          .attr("x1", function(d) { return -d.r + 2 * d.r * d.k; })
          .attr("y1", function(d) { return -Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); })
          .attr("x2", function(d) { return -d.r + 2 * d.r * d.k; })
          .attr("y2", function(d) { return Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); });

      node.selectAll("circle")
          .attr("r", function(d) { return r(d.count); });
    }

    // Update the displayed node labels.
    function updateLabels() {
      label = label.data(data.groupes, function(d) { return d.name; });

      label.exit().remove();

      var labelEnter = label.enter().append("a")
          .attr("class", "g-label")
          .call(force.drag)
          .call(linkTopic);

      labelEnter.append("div")
          .attr("class", "g-name")
          .text(function(d) { return d.name; });
      /*labelEnter.append("div")
          .attr("class", "g-percent")
          .style("font-size", function(d) { return Math.max(10, d.r / 2) + "px"; })
          .text(function(d) {return Math.round(d.F/(d.F + d.H) * 100) + " %"; });*/

      labelEnter.append("div")
          .attr("class", "g-value")
          .style("font-size", function(d) { return Math.max(10, d.r / 3) + "px"; })
          .text(function(d) { return d.F +" - "+ d.H;});

      label
          .style("font-size", function(d) { return Math.max(10, d.r / 4) + "px"; })
          .style("width", function(d) { return d.r + "px"; })
          .style("display", "flex");

      // Create a temporary span to compute the true text width.
      label.append("span")
          .text(function(d) { return d.name; })
          .each(function(d) { d.dx = Math.max(d.r * 2.5, this.getBoundingClientRect().width); })
          .remove();

      label
          .style("width", function(d) { return d.dx + "px"; });

      // Compute the height of labels when wrapped.
      label.each(function(d) { d.dy = this.getBoundingClientRect().height; })
          .style("height", function(d) { return d.dy + "px"; });

      d3.selectAll(".g-name").style("margin","auto");
      d3.selectAll(".g-value").style("margin","auto");
          
    }


    // Assign event handlers to topic links.
    function linkTopic(a) {
      a   .on("mouseover", mouseover)
          .on("mouseout", mouseout);
    }


    // Simulate forces and update node and label positions on tick.
    function tick(e) {
      node
          .each(bias(e.alpha * 105))
          .each(collide(0.5))
          .attr("transform", function(d) { return "translate(" + Math.max(50, d.x) + "," + d.y + ")"; });

      label
          .style("left", function(d) { return (Math.max(50, d.x) - d.dx / 2) + "px"; })
          .style("top", function(d) { return (d.y - d.dy / 2) + "px"; });
    }

    // A left-right bias causing topics to orient by party preference.
    function bias(alpha) {
      return function(d) {
        d.x += d.bias * alpha;
      };
    }

    // Resolve collisions between nodes.
    function collide(alpha) {
      var q = d3.geom.quadtree(data.groupes);
      return function(d) {
        var r = d.cr + maxRadius + collisionPadding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        q.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d) && d.other !== quad.point && d !== quad.point.other) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.cr + quad.point.r + collisionPadding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }

    // Given two quantities a and b, returns the fraction to split the circle a + b.
    function fraction(a, b) {
      var k = a / (a + b);
      if (k > 0 && k < 1) {
        var t0, t1 = Math.pow(12 * k * Math.PI, 1 / 3);
        for (var i = 0; i < 10; ++i) { // Solve for theta numerically.
          t0 = t1;
          t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * k * Math.PI) / (1 - Math.cos(t0));
        }
        k = (1 - Math.cos(t1 / 2)) / 2;
      }
      return k;
    }

    function mouseover(element) {
      node.classed("g-hover", function(p) { return p === element; });
      label.classed("g-hover", function(p) { return p === element; });
    }

    function mouseout(element) {
      node.classed("g-hover", false);
      label.classed("g-hover", false);
    }
  });
}