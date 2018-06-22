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
const RGB = new RGBquery.RGBquery();
// a templated url to query against -- needs to include {z}/{x}/{y}
const template = "https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token={your MapboxAccessToken here!}";
const lnglat = [-122.16579, 42.92128];

RGB.queryElevation(lnglat, template)
  .then((elevation) => {
    console.log(elevation)
  })
  .catch((err) => {
    console.error(err)
  })
// optionally, you can specify a zoom level to query [default=14]
const zoom = 10;
RGB.queryElevation(lnglat, template, zoom)
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
```


### Browser
Barebones demo application in `/demo` -- click on map to query elevation.  
```
$ npm start
```
And then open http://localhost:5000/demo/
