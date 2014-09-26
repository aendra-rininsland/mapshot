# mapshot.js
## A nodeJS server for taking screenshots of maps
### 2014 [Ændrew Rininsland](http://github.com/aendrew), [The Times and Sunday Times](http://github.com/times)

Made for the 2014 #IndyRef, using 12 factor principles.

#### Configuration (Heroku)

1. Install Heroku toolbelt.
1. Create a new app:
`$ heroku create a-mapshot-site --region=eu`
1. Set the following env vars:
```bash
$ heroku config:set MAPSHOT_AWS_KEY="xyz" # AWS S3 ID key
$ heroku config:set MAPSHOT_AWS_SECRET="zyx" # AWS S3 secret key
$ heroku config:set MAPSHOT_AWS_BUCKET="a-bucket" # AWS S3 bucket name
$ heroku config:set MAPSHOT_AWS_S3_PATH="/a/path/to/stuff" # Path to save output map
$ heroku config:set MAPSHOT_AWS_S3_FILENAME="map.png" # Output map filename
$ heroku config:set MAPSHOT_MAP_URL="http://nuk-tnl-editorial-prod-staticassets.s3-website-eu-west-1.amazonaws.com/2014/maps/scottish-referendum-map/" # URL to screenshot
$ heroku config:set MAPSHOT_MAP_BROWSER_WIDTH=1600 # Browser viewport width
$ heroku config:set MAPSHOT_MAP_BROWSER_HEIGHT=1200 # Browser viewport height
$ heroku config:set MAPSHOT_CSS_SELECTOR="#map" # Selector of element to screencap
$ heroku config:set MAPSHOT_ELEMENT_OFFSET_TOP=0 # Pixels from top of element to offset screencap region
$ heroku config:set MAPSHOT_ELEMENT_OFFSET_LEFT=0 # Pixels from left of element to offset screen region
$ heroku config:set MAPSHOT_SNAPSHOT_WIDTH=335 # Screencap region width in pixels
$ heroku config:set MAPSHOT_SNAPSHOT_HEIGHT=560 # Screencap region height in pixels
$ heroku config:set MAPSHOT_SNAPSHOT_INTERVAL=60000 # Interval to run screengrab routine
$ heroku config:set MAPSHOT_SNAPSHOT_TIMEOUT=5000 # Time to wait for map to load before screencap
$ heroku config:set MAPSHOT_LOCAL_MAP_FILENAME='map.png' # Temporary local filename for map screencap
```
1. `$ git push master heroku`

Taaa-daaaa.
