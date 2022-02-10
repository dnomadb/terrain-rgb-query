'use strict';
const tilebelt = require('@mapbox/tilebelt')
const getPixels = require("get-pixels");
const locking = require('@mapbox/locking');
const interp = require("ndarray-linear-interpolate").d2;
const ndarray = require("ndarray");

const _getPixels = locking((url, callback) => {
  return getPixels(url, null, callback);
});


const cachedGetPixels = (url) => {
  return new Promise((resolve, reject) => {
    _getPixels(url, (err, data) => {
      if (err) reject(err);
      return resolve(data);
    })
  });
}


class TerrainRGBquery {
  constructor(endpoint, tileSize) {
    if (!/.*\{z\}\/\{x\}\/\{y\}.*/.test(endpoint)) {
      throw new Error(`Endpoint ${endpoint} should include {z}/{x}/{y}`);
    }
    this.endpoint = endpoint;
    this.tileSize = tileSize || 256;
  };

  queryElevations(lnglats, zoom) {
    return Promise.all(lnglats.map((lnglat) => {
      return this.queryElevation(lnglat, zoom);
    }));
  }

  interpolateElevation(data, x, y) {

    const fx = Math.floor(x);
    const fy = Math.floor(y);
  
    const grid = ndarray(new Float32Array(4), [2, 2]);
    for (let i = fy; i < fy + 2; i++) {
      for (let j = fx; j < fx + 2; j++) {
        const r = data.get(j + 1, i + 1, 0)
        const g = data.get(j + 1, i + 1, 1)
        const b = data.get(j + 1, i + 1, 2);

        grid.set(j - fx, i - fy, -10000 + ((r << 16) + (g << 8) + b) * 0.1);
      }
    }

    let elev = interp(grid, x % fx, y % fy);

    if (isNaN(elev)) {
      const r = data.get(fx, fy, 0);
      const g = data.get(fx, fy, 1);
      const b = data.get(fx, fy, 2);
      elev = -10000 + ((r << 16) + (g << 8) + b) * 0.1;
    }

    return elev;
  }

  async queryElevation(lnglat, zoom) {
    zoom = zoom || 14;

    const [x, y] = tilebelt.pointToTileFraction(lnglat[0], lnglat[1], zoom)
    const pX = (x % Math.floor(x)) * this.tileSize;
    const pY = (y % Math.floor(y)) * this.tileSize;

    const tile = `${zoom}/${Math.floor(x)}/${Math.floor(y)}`;
    const url = this.endpoint.replace(/\{z\}\/\{x\}\/\{y\}/, tile);

    const data = await cachedGetPixels(url);

    return this.interpolateElevation(data, pX, pY);
  };
};

module.exports.TerrainRGBquery = TerrainRGBquery;
