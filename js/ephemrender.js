var graphics = (function() {
   var projections = {"mercator": d3.geo.mercator,
      "orthographic": d3.geo.orthographic}

   var init = function(){
      set_projection("mercator")
   }
   var projection
   var path
   function set_projection(proj_str){
      projection = projections[proj_str]()
   .translate([window.innerWidth / 2, window.innerHeight / 2])
   .precision(.1);
projection.string = proj_str
   path = d3.geo.path()
   .pointRadius(0.1)
   .projection(projection);
   }

var update_projection = function(orbit) {
      position = ephemgen(tles[tracking], 1)
      if (projection.string == "orthographic") {
         projection.clipAngle(90)
            .rotate([- position[0][0], -position[0][1]/2])
            .scale((window.innerWidth + 1) / 1.5 / Math.PI)
      }
   if (projection.string == "mercator") {
      // rotate view along spin axis only
      projection.rotate([- position[0][0], 0])
         .scale((window.innerWidth + 1) / 1.5 / Math.PI)
   }
}
var render_earth = function(earth, path, svg) {
   $("#mysvg").empty(); 

   svg.append("defs").append("path")
      .datum({type: "Sphere"})
      .attr("id", "sphere")
      .attr("d", path);

   svg.append("path")
      .datum(earth.grid)
      .attr("class", "graticule")
      .attr("d", path);

   svg.insert("path", ".graticule")
      .datum(earth.land)
      .attr("class", "land")
      .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
      .attr("d", path);

   svg.insert("path", ".graticule")
      .datum(earth.borders)
      .attr("class", "boundary")
      .attr("d", path);
}

var render_ephemeris = function(orbit, path, svg) {
   var sat = {type: 'MultiPoint', coordinates : orbit}
   svg.insert("path", ".graticule")
      .datum(sat)
      .attr("class", "orbit")
      .attr("d", path);
}

var render = function(orbits, satellites) {
   update_projection(orbit);
   render_earth(earth, path, svg)
      for (var i = 0; i < satellites.length; i++) { 
         console.log(satellites);
         console.log(tles[satellites[i]]);
            var orbit = orbits[i]//ephemgen(tles[satellites[i]], 1500)
            render_ephemeris(orbit, path, svg)
      }
}

init()
   return { render: render,
      set_projection: set_projection,
      update_projection: update_projection
   }
      }());

