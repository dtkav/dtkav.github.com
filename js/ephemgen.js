//  Sample TLE

function ephemgen(tle, seconds) {
   longlats = [];
   for (var i = 0; i < seconds; i++) {
      // Initialize a satellite record
      var satrec = satellite.twoline2satrec (tle[0], tle[1]);
      
      //  Propagate satellite using time since epoch (in minutes).
      //var position_and_velocity = satellite.sgp4 (satrec, satellite.time_since_tle_epoch_minutes);
      //  Or you can use a calendar date and time (obtained from Javascript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)).
      var now = new Date();
      var propagated_time = new Date(+now + 10000*i);
      
      // NOTE: while Javascript Date returns months in range 0-11, all satellite.js methods require months in range 1-12.
      var position_and_velocity = satellite.propagate (satrec,
                                                      propagated_time.getUTCFullYear(), 
                                                      propagated_time.getUTCMonth() + 1, // Note, this function requires months in range 1-12. 
                                                      propagated_time.getUTCDate(),
                                                      propagated_time.getUTCHours(), 
                                                      propagated_time.getUTCMinutes(), 
                                                      propagated_time.getUTCSeconds() + i);
      
      // The position_velocity result is a key-value pair of ECI coordinates.
      // These are the base results from which all other coordinates are derived.
      var position_eci = position_and_velocity["position"];
      var velocity_eci = position_and_velocity["velocity"];
      
      // Set the Observer at 122.03 West by 36.96 North, in RADIANS
      var deg2rad = Math.PI / 180;
      var observer_gd = {
          longitude : -122.0308  * deg2rad,
          latitude  : 36.9613422 * deg2rad,
          height    : .370
      };
      
      // You will need GMST for some of the coordinate transforms
      // Also, be aware that the month range is 1-12, not 0-11.
      var gmst = satellite.gstime_from_date (propagated_time.getUTCFullYear(), 
                                       propagated_time.getUTCMonth() + 1, // Note, this function requires months in range 1-12. 
                                       propagated_time.getUTCDate(),
                                       propagated_time.getUTCHours(), 
                                       propagated_time.getUTCMinutes(), 
                                       propagated_time.getUTCSeconds());
      
      
      // You can get ECF, Geodetic, Look Angles, and Doppler Factor.
      var position_ecf   = satellite.eci_to_ecf (position_eci, gmst);
      var observer_ecf   = satellite.geodetic_to_ecf (observer_gd);
      var position_gd    = satellite.eci_to_geodetic (position_eci, gmst);
      var look_angles    = satellite.ecf_to_look_angles (observer_gd, position_ecf);
      //var doppler_factor = satellite.doppler_factor (satellite.observer_coords_ecf, position_ecf, velocity_ecf);
      
      
      // The coordinates are all stored in key-value pairs.
      // ECI and ECF are accessed by "x", "y", "z".
      var satellite_x = position_eci["x"];
      var satellite_y = position_eci["y"];
      var satellite_z = position_eci["z"];
      
      // Look Angles may be accessed by "azimuth", "elevation", "range_sat".
      var azimuth   = look_angles["azimuth"];
      var elevation = look_angles["elevation"];
      var rangeSat  = look_angles["rangeSat"];
      
      // Geodetic coords are accessed via "longitude", "latitude", "height".
      var longitude = position_gd["longitude"];
      var latitude  = position_gd["latitude"];
      var height    = position_gd["height"];
      
      //  Convert the RADIANS to DEGREES for pretty printing (appends "N", "S", "E", "W". etc).
      var longitude_str = satellite.degrees_long (longitude);
      var latitude_str  = satellite.degrees_lat  (latitude);
      longlats.push([longitude_str, latitude_str])
   }
   return longlats
}
