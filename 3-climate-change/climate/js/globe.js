//Rotating Orthographic
//http://bl.ocks.org/mbostock/6619561

function init() {
    var width = 800,
        height = 600,
        speed = 1e-2,
        start = Date.now();

    var sphere = {type: "Sphere"};

    var projection = d3.geo.orthographic()
        .scale(height / 2.1)
        .translate([width / 2, height / 2])
        .clipAngle(90)
        .precision(.5);

    var graticule = d3.geo.graticule();

    var canvas = d3.select("#globe").append("canvas")
        .attr("width", width)
        .attr("height", height);

    var context = canvas.node().getContext("2d");

    var path = d3.geo.path()
        .projection(projection)
        .context(context);

    d3.json("topo/world-110m.json", function(error, topo) {
        var land = topojson.feature(topo, topo.objects.land),
            borders = topojson.mesh(topo, topo.objects.countries, function(a, b) { return a !== b; }),
            grid = graticule();

        d3.timer(function() {
            projection.rotate([speed * (Date.now() - start), -15]);

            context.clearRect(0, 0, width, height);

            context.beginPath();
            path(sphere);
            context.lineWidth = 3;
            context.strokeStyle = "#000";
            context.stroke();

            context.beginPath();
            path(sphere);
            context.fillStyle = "#fff";
            context.fill();

            context.beginPath();
            path(land);
            context.fillStyle = "#222";
            context.fill();

            context.beginPath();
            path(borders);
            context.lineWidth = .5;
            context.strokeStyle = "#fff";
            context.stroke();

            context.beginPath();
            path(grid);
            context.lineWidth = .5;
            context.strokeStyle = "rgba(119,119,119,.5)";
            context.stroke();
        });
    });

    d3.select(self.frameElement).style("height", height + "px");
}

document.addEventListener("DOMContentLoaded", init, false);