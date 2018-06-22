#!/usr/bin/env node
'use strict';
const RGBquery = require('../index.js');
const argv = require('minimist')(process.argv.slice(2));


if (!argv._) throw new Error("'[{lng}, {lat}]' should be provided");
if (!process.env.MapboxAccessToken) throw new Error("A valid MapboxAccessToken must be exported to your environment");

const lnglat = JSON.parse(argv._[0]);
const template = `https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=${process.env.MapboxAccessToken}`;

const RGB = new RGBquery.RGBquery();

RGB.queryElevation(lnglat, template)
  .then((elevation) => {
    console.log(elevation)
  })
  .catch((err) => {
    console.error(err)
  })
