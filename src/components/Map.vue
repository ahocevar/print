<template>
  <div class="map" id="map-container" ref="mapContainer">
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import WMTSSource from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {getTopLeft} from 'ol/extent';
import Projection from 'ol/proj/Projection';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {Fill, Stroke, Style} from 'ol/style';

export default {
  name: 'Map',
  created() {
    proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");
    register(proj4);
    this.projection = new Projection({ code: 'EPSG:28992', extent: [-285401.92, 22598.08, 595401.92, 903401.92], units: 'm'});
    this.map = new Map({
      layers: [
        new TileLayer({
          visible: true,
          source: new WMTSSource({
            url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts?',
            layer: 'brtachtergrondkaart',
            matrixSet: 'EPSG:28992',
            format: 'image/png',
            projection: this.projection,
            tileGrid: new WMTSTileGrid({
              origin: getTopLeft(this.projection.getExtent()),
              resolutions:  [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
              matrixIds: ["EPSG:28992:0", "EPSG:28992:1", "EPSG:28992:2", "EPSG:28992:3", "EPSG:28992:4", "EPSG:28992:5", "EPSG:28992:6", "EPSG:28992:7", "EPSG:28992:8", "EPSG:28992:9", "EPSG:28992:10", "EPSG:28992:11", "EPSG:28992:12", "EPSG:28992:13", "EPSG:28992:14"],
            })
          })
        }),
        new TileLayer({
          visible: false,
          source: new WMTSSource({
            url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wmts',
            layer: '2018_ortho25',
            matrixSet: 'EPSG:28992',
            format: 'image/png',
            projection: this.projection,
            tileGrid: new WMTSTileGrid({
              origin: getTopLeft(this.projection.getExtent()),
              resolutions:  [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
              matrixIds: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14"],
            })
          })
        }),
        new TileLayer({
          visible: false,
          source: new TileWMS({
            url: 'https://services.rce.geovoorziening.nl/rce/wfs?',
            params: {
              LAYERS: 'rce:NationalListedMonuments',
              TILED: false,
              STYLES: 'Rijksmonumenten',
              FORMAT: 'image/png',
            },
          }),
        }),
        new VectorLayer({
          source: new VectorSource({
            url: 'krw.json',
            format: new GeoJSON(),
          }),
          style: new Style({
            fill: new Fill({
              color: 'red',
            }),
            stroke: new Stroke({
              color: 'black',
              width: 1,
            }),
          }),
        }),
      ],
      view: new View({
        minResolution: 0.02625,
        maxResolution: 430.08,
        projection: this.projection,
        center: [150000, 450000],
        zoom: 0,
      }),
    });
  },
  mounted() {
    this.map.setTarget(this.$refs.mapContainer);
  },
  props: {
  }
}
</script>

<style scoped>
.map {
  height: 100%;
  width: 100%;
}
</style>
