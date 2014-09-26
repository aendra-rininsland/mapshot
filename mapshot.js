/**
 *  mapshot.js
 *
 *  Automated election map screenshotter
 *  2014 Ændrew Rininsland, The Times and Sunday Times
 *  License: MIT
 *
 */

var config = {
  AWS_KEY: (process.env.MAPSHOT_AWS_KEY || false),
  AWS_SECRET: (process.env.MAPSHOT_AWS_SECRET || false),
  AWS_BUCKET: (process.env.MAPSHOT_AWS_BUCKET || false),
  S3_PATH: (process.env.MAPSHOT_AWS_S3_PATH || '/2014/maps/scottish-referendum-map'),
  S3_MAP_FILENAME: (process.env.MAPSHOT_AWS_S3_FILENAME || 'map.png'),
  MAP_URL: (process.env.MAPSHOT_MAP_URL || 'http://nuk-tnl-editorial-prod-staticassets.s3-website-eu-west-1.amazonaws.com/2014/maps/scottish-referendum-map/'),
  MAP_BROWSER_WIDTH: (parseInt(process.env.MAPSHOT_MAP_BROWSER_WIDTH) || 1600),
  MAP_BROWSER_HEIGHT: (parseInt(process.env.MAPSHOT_MAP_BROWSER_HEIGHT) || 1200),
  MAP_CSS_SELECTOR: (process.env.MAPSHOT_CSS_SELECTOR || '#map'),
  SNAPSHOT_OFFSET_TOP: (parseInt(process.env.MAPSHOT_ELEMENT_OFFSET_TOP) || 0),
  SNAPSHOT_OFFSET_LEFT: (parseInt(process.env.MAPSHOT_ELEMENT_OFFSET_LEFT) || 0),
  SNAPSHOT_WIDTH: (parseInt(process.env.MAPSHOT_SNAPSHOT_WIDTH) || 335),
  SNAPSHOT_HEIGHT: (parseInt(process.env.MAPSHOT_SNAPSHOT_HEIGHT) || 560),
  SNAPSHOT_INTERVAL: (parseInt(process.env.MAPSHOT_SNAPSHOT_INTERVAL) || 60000),
  SNAPSHOT_WAIT_PERIOD: (parseInt(process.env.MAPSHOT_SNAPSHOT_TIMEOUT) || 5000),
  LOCAL_MAP_FILENAME: (process.env.MAPSHOT_LOCAL_MAP_FILENAME || 'map.png')
};

var knox = require('knox');
var fs = require('fs');
var client = knox.createClient({
  key: config.AWS_KEY,
  secret: config.AWS_SECRET,
  bucket: config.AWS_BUCKET
});

function snapshotMap() {
  console.log('➫ Taking snapshot...');
  var phantom = require('phantom');
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.set('viewportSize', {
        width: config.MAP_BROWSER_WIDTH,
        height: config.MAP_BROWSER_HEIGHT
      });
      page.set('settings.localToRemoteUrlAccessEnabled', true);
      page.open(config.MAP_URL, function() {
        setTimeout(function () {
          page.evaluate(function (selector) {
              var cr = document.querySelector(selector).getBoundingClientRect();
              return cr;
            },
            function (result) {
              page.set('clipRect', {
                top:    result.top + config.SNAPSHOT_OFFSET_TOP,
                left:   result.left + config.SNAPSHOT_OFFSET_LEFT,
                width:  config.SNAPSHOT_WIDTH,
                height: config.SNAPSHOT_HEIGHT
              });

              console.log('➫ Rendering to file: ' + config.LOCAL_MAP_FILENAME);
              page.render(config.LOCAL_MAP_FILENAME, function(){
                // Push to S3
                try {
                  var output = fs.readFileSync(config.LOCAL_MAP_FILENAME);
                  var bucketPath = config.S3_PATH + '/' + config.S3_MAP_FILENAME;
                  var req = client.put(bucketPath, {
                    'Content-Length': output.length,
                    'Content-Type': 'image/png',
                    'x-amz-acl': 'public-read'
                  });
                  req.on('response', function(res){
                    if (200 === res.statusCode) {
                      console.log('➫ Saved updated map image to %s', req.url);
                    }
                  });
                  req.end(output);
                  return true;
                } catch(e) {
                  console.log('⤫ Problem pushing updated map to S3...');
                  console.dir(e);
                  return false;
                }

                ph.exit();
              });
            },
            config.MAP_CSS_SELECTOR
          );
        }, config.SNAPSHOT_WAIT_PERIOD);
      });
    });
  });
}

// Run it!
setInterval(snapshotMap(), config.SNAPSHOT_INTERVAL);
