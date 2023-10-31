import React from 'react';

export const removeFeaturesVectorLayer = (layerName: string, map: any) => {
  try {
    map
      .getLayers()
      .getArray()
      .forEach((layer: any) => {
        if (layer.get('name') === layerName) {
          const source = layer.getSource();
          const features = source.getFeatures();
          if (features && features.length > 0) {
            features.forEach((item) => source.removeFeature(item));
          }
        }
      });
  } catch (error) {
    console.error('Ошибка при удалении сообщений', error);
  }
};
