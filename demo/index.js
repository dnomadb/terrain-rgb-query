const terrainRGBquery = require('../index.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiZG5vbWFkYiIsImEiOiJjaW16aXFsZzUwNHJmdjdra3h0Nmd2cjY1In0.SqzkaKalXxQaPhQLjodQcQ';
const template = `https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=${mapboxgl.accessToken}`;

const TRGB = new terrainRGBquery.TerrainRGBquery();
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/outdoors-v9', // stylesheet location
    center: [-122.16579, 42.92128], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.on('click', (e) => {
  const lnglat = [e.lngLat.lng, e.lngLat.lat];

  TRGB.queryElevation(lnglat, template)
    .then((elevation) => {
      elevation = Math.round(elevation);
      alert(`You clicked an elevation of ${elevation}m`);
    })
    .catch((err) => {
      console.error(err);
    })
})
