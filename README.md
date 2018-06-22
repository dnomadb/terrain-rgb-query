# terrain-rgb-query
Query elevation values from an rgb-encoded tileset

## install
Right now, install via github
```
$ git clone git@github.com:dnomadb/terrain-rgb-query.git

$ cd terrain-rgb-query

$ npm install && npm link
```

## usage
While you can use `terrain-rgb-query` on any tiled, RGB-encoded elevation datasource,
it was primarily written to query `mapbox.terrain-rgb`. You'll need a valid Mapbox Access Token for this.

### API
```javascript
// a templated url to query against -- needs to include {z}/{x}/{y}
const template = "https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token={your MapboxAccessToken here!}";
const TRGB = new terrainRGBquery.TerrainRGBquery(template);
const lnglat = [-122.16579, 42.92128];

TRGB.queryElevation(lnglat)
  .then((elevation) => {
    console.log(elevation)
  })
  .catch((err) => {
    console.error(err)
  })

// If you have more than one to query use queryElevations -- tiles are cached so tile
// requests are unique
const lnglats = [[-122.16579, 42.92128], [-122.17579, 42.93128]];
TRGB.queryElevations(lnglats)
  .then((elevations) => {
    console.log(elevations)
  })
  .catch((err) => {
    console.error(err)
  })
// optionally, you can specify a zoom level to query [default=14]
const zoom = 10;
TRGB.queryElevation(lnglat, zoom)
  .then((elevation) => {
    console.log(elevation)
  })
  .catch((err) => {
    console.error(err)
  })
```

### CLI
You'll need a valid mapbox access token exported to your environment:
```bash
$ export MapboxAccessToken=pk.{....}
```
Then you can query elevations by lng, lat:
```bash
$ get-elev '[-122.16579, 42.92128]'
2170.7000000000007

$ get-elev '[[-122.16579, 42.92128], [-122.16579, 42.92128]]'
[2170.7000000000007,2170.7000000000007]
```


### Browser
Barebones demo application in `/demo` -- click on map to query elevation.  
```
$ npm start
```
And then open http://localhost:5000/demo/
