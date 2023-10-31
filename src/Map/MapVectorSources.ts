import VectorSource from 'ol/source/Vector';
import { vectorLayers, wfsLayers, wmsTileLayers } from './layers.mock';
import GeoJSON from 'ol/format/GeoJSON';
import axios from 'axios';
import { gisSchemaHeader, pgApiUrl, publicSchemaHeader } from '../config/constants';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';

const vectorLayersGroups = [...new Set(wmsTileLayers.map((item) => item.group))];

// ------------------Слои для отображения прозрачной геометрии дорог---------
const invisibleRoadSourcesArr = [
  ...new Set(wfsLayers.filter((item) => item.layersType !== 'bridge' && item.visible).map((item) => item.zoomSource)),
];

export const invisibleRoadSourcesByZoom = invisibleRoadSourcesArr.map((zoomSource) => {
  const source = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection, success, failure) => {
      try {
        const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));
        const obj = {
          p_zoom: zoom,
          p_box: extent,
          p_scale_factor: 1,
        };
        const geo: any = await axios.post(`${pgApiUrl}/rpc/get_road_lr_geobox`, obj, publicSchemaHeader);
        if (geo?.data && geo?.data?.features && geo?.data?.features.length > 0) {
          //source.clear();
          const features = new GeoJSON().readFeatures(geo?.data);
          source.addFeatures(features);
          success(features);
        }
      } catch (error) {
        console.error('Ошибка при загрузке вектора дорог!', error);
        failure();
      }
    },
    strategy: bboxStrategy,
  });
  return {
    [zoomSource]: source,
  };
});

//--------------Полупрозрачный вектор мостов------------
const invisibleBridgeSourcesArr = [...new Set(wfsLayers.filter((item) => item.layersType === 'bridge').map((item) => item.zoomSource))];

export const invisibleBridgeSourcesByZoom = invisibleBridgeSourcesArr.map((zoomSource) => {
  const source = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection, success, failure) => {
      try {
        const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));
        const obj = {
          p_zoom: zoom,
          p_box: extent,
          p_scale_factor: 1,
        };
        const geo: any = await axios.post(`${pgApiUrl}/rpc/get_bridge_geobox`, obj, publicSchemaHeader);
        if (geo?.data && geo?.data?.features && geo?.data?.features.length > 0) {
          //source.clear();
          const features = new GeoJSON().readFeatures(geo?.data);
          source.addFeatures(features);
          success(features);
        }
      } catch (error) {
        console.error('Ошибка при загрузке вектора мостов!', error);
        failure();
      }
    },
    strategy: bboxStrategy,
  });
  return {
    [zoomSource]: source,
  };
});

// -----------------Удалить, временный source, уже не используется
export const roadVectorSource = new VectorSource({
  format: new GeoJSON(),
  loader: async (extent, resolution, projection, success, failure) => {
    try {
      const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));
      const obj = {
        p_zoom: zoom,
        p_box: extent,
        p_scale_factor: 1,
      };
      const geo: any = await axios.post(`${pgApiUrl}/rpc/get_road_lr_geobox`, obj, publicSchemaHeader);
      if (geo?.data && geo?.data?.features && geo?.data?.features.length > 0) {
        //source.clear();
        const features = new GeoJSON().readFeatures(geo?.data);
        roadVectorSource.addFeatures(features);
        success(features);
      }
    } catch (error) {
      console.error('Ошибка при загрузке вектора дорог!', error);
      failure();
    }
  },
  strategy: bboxStrategy,
});

//----------------------------------------- Временный source, уже не используется, удалить
const sourceArrByZoom = [...new Set(wfsLayers.filter((item) => item.layersType !== 'bridge').map((item) => item.zoomSource))];

export const roadVectorSourcesByZoom = sourceArrByZoom.map((zoomSource) => {
  const source = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection, success, failure) => {
      try {
        const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));
        const obj = {
          p_zoom: zoom,
          p_box: extent,
          p_scale_factor: 1,
        };
        const geo: any = await axios.post(`${pgApiUrl}/rpc/get_road_lr_geobox`, obj, publicSchemaHeader);
        if (geo?.data && geo?.data?.features && geo?.data?.features.length > 0) {
          //source.clear();
          const features = new GeoJSON().readFeatures(geo?.data);
          source.addFeatures(features);
          success(features);
        }
      } catch (error) {
        console.error('Ошибка при загрузке вектора дорог!', error);
        failure();
      }
    },
    strategy: bboxStrategy,
  });
  return {
    [zoomSource]: source,
  };
});

const sourceBridgeArrByZoom = [...new Set(wfsLayers.filter((item) => item.layersType === 'bridge').map((item) => item.zoomSource))];

export const bridgeVectorSourcesByZoom = sourceBridgeArrByZoom.map((zoomSource) => {
  const source = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection, success, failure) => {
      try {
        const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));
        const obj = {
          p_zoom: zoom,
          p_box: extent,
          p_scale_factor: 1,
        };
        const geo: any = await axios.post(`${pgApiUrl}/rpc/get_bridge_geobox`, obj, publicSchemaHeader);
        if (geo?.data && geo?.data?.features && geo?.data?.features.length > 0) {
          //source.clear();
          const features = new GeoJSON().readFeatures(geo?.data);
          source.addFeatures(features);
          success(features);
        }
      } catch (error) {
        console.error('Ошибка при загрузке вектора мостов!', error);
        failure();
      }
    },
    strategy: bboxStrategy,
  });
  return {
    [zoomSource]: source,
  };
});

export const layerVectorSource = vectorLayers
  .filter((item) => item?.selected)
  .map((item: any) => {
    const source = new VectorSource({
      format: new GeoJSON(),
      loader: async (extent, resolution, projection, success, failure) => {
        try {
          const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));
          const obj = {
            p_zoom: zoom,
            p_box: extent,
            p_scale_factor: 1,
          };
          const geo: any = await axios.post(`${pgApiUrl}/rpc/get_road_segment_geobox`, obj, publicSchemaHeader);
          if (geo?.data && geo?.data?.features && geo?.data?.features.length > 0) {
            // if (isFilterChanged) {
            //  const filterfeatures = gayFilters(geo?.data?.features, extent);
            // } else {
            //source.clear();
            const features = new GeoJSON().readFeatures(geo?.data);
            source.addFeatures(features);
            success(features);
            //}
          }
        } catch (error) {
          console.error('Ошибка при загрузке вектора аналитических слоев!', error);
          failure();
        }
      },
      strategy: bboxStrategy,
    });

    return {
      [item.name]: source,
    };
  });

//Source для векторных дорог

const sourceForRoadByZoom = [
  ...new Set(wmsTileLayers.filter((item) => item.source === 'road')?.[0].zoomLevels.map((item, index) => `road_${index}`)),
];

export const roadSources = sourceForRoadByZoom.map((zoomSource) => {
  const source = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection, success, failure) => {
      try {
        const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));
        const obj = {
          p_zoom: zoom,
          p_box: extent,
          p_scale_factor: 1,
        };
        const geo: any = await axios.post(`${pgApiUrl}/rpc/get_road_lr_geobox`, obj, publicSchemaHeader);
        if (geo?.data && geo?.data?.features && geo?.data?.features.length > 0) {
          //source.clear();
          const features = new GeoJSON().readFeatures(geo?.data);
          source.addFeatures(features);
          success(features);
        }
      } catch (error) {
        console.error('Ошибка при загрузке источника вектора дорог!', error);
        failure();
      }
    },
    strategy: bboxStrategy,
  });
  return {
    [zoomSource]: source,
  };
});

//-----Источник для мостовых сооружений
const sourceForBridgeByZoom = [
  ...new Set(wmsTileLayers.filter((item) => item.source === 'bridge')?.[0].zoomLevels.map((item, index) => `bridge_${index}`)),
];

export const bridgeSources = sourceForBridgeByZoom.map((zoomSource) => {
  const source = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection, success, failure) => {
      try {
        const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));
        const obj = {
          p_zoom: zoom,
          p_box: extent,
          p_scale_factor: 1,
        };

        const geo: any = await axios.post(`${pgApiUrl}/rpc/get_bridge_geobox`, obj, publicSchemaHeader);
        //debugger;
        if (geo?.data && geo?.data?.features && geo?.data?.features.length > 0) {
          //source.clear();
          const features = new GeoJSON().readFeatures(geo?.data);
          source.addFeatures(features);
          success(features);
        }
      } catch (error) {
        console.error('Ошибка при загрузке источника вектора мостов!', error);
        failure();
      }
    },
    strategy: bboxStrategy,
  });
  return {
    [zoomSource]: source,
  };
});
