'use strict';
const sm = require('@mapbox/sphericalmercator');
const getPixels = require("get-pixels");
const locking = require('@mapbox/locking');

const _getPixels = (url, callback) => {
  return getPixels(url, null, callback);
};

const cachedGetPixels = locking(_getPixels);


class TerrainRGBquery {
  constructor(endpoint, tileSize) {
    if (!/.*\{z\}\/\{x\}\/\{y\}.*/.test(endpoint)) {
      throw new Error(`Endpoint ${endpoint} should include {z}/{x}/{y}`);
    }
    this.endpoint = endpoint;
    this.tileSize = tileSize || 256;
    this.merc = new sm({size: this.tileSize});
  };

  queryElevations(lnglats, zoom) {
    return Promise.all(lnglats.map((lnglat) => {
      return this.queryElevation(lnglat, zoom);
    }));
  }

  queryElevation(lnglat, zoom) {
    zoom = zoom || 14;
    return new Promise((resolve, reject) => {
      const px = this.merc.px(lnglat, zoom);
      const xy = px.map((coord)=> {
        return Math.floor(coord / this.tileSize);
      });
      const tile = `${zoom}/${xy[0]}/${xy[1]}`;
      const url = this.endpoint.replace(/\{z\}\/\{x\}\/\{y\}/, tile);

      return cachedGetPixels(url, (err, resp) => {
        if (err) return reject(err);

        const tilePx = this.merc.px(lnglat, zoom).map((coord) => {
          return Math.floor(coord % this.tileSize);
        });

        const stride = 4; //argb channels, one per channel
        // desired pixel position is at row number * pixels per row, plus column number, and the sum multiplied by stride length
        const pxIndex = stride * (tilePx[0] + tilePx[1] * this.tileSize);

        const [r,g,b] = [resp.data[pxIndex], resp.data[pxIndex + 1], resp.data[pxIndex + 2]];
        const elevation = -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1);

        return resolve(elevation);
      });
    });
  };
};

module.exports.TerrainRGBquery = TerrainRGBquery;
