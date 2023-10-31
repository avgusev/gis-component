import React from 'react';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Circle, Fill, Stroke, Style } from 'ol/style.js';
import { RMap, ROSM, RLayerVector, RFeature, RFeatureUIEvent } from 'rlayers';
import '../../ol.scss';
import GeoLoader from '../GeoLoader/GeoLoader';
import { fromLonLat } from 'ol/proj';

export type GeoPanoramaMapType = {
  diagId: number;
  roadId: number;
  selected: any;
  onFeatureClick(e): void;
  year: number;
  features: any[];
};

export const GeoPanoramaMap = ({ onFeatureClick, diagId, roadId, year, features, selected }: GeoPanoramaMapType) => {
  const [points, setPoints] = React.useState<any[]>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    console.log('Обновление компоненты GeoPanoramaMap');
    if (features?.length > 0) {
      const points_ = features?.map((f, i) => {
        console.log('Сущность в карте:', f);
        return new Feature({
          geometry: new Point(fromLonLat([f.lon, f.lat])),
          name: f.pano,
          uid: f.num,
          properties: { f },
          id: f.num,
          style: cstyle,
        });
      });

      setPoints(points_);
      setLoading(false);
      // vectorRef?.current?.forceUpdate();
    }
  }, [features]);

  const fill = new Fill({
    color: 'rgba(255,0,0,0.9)',
  });

  const hfill = new Fill({
    color: 'rgba(40,0,255,1)',
  });

  const stroke = new Stroke({
    color: '#ff0000',
    width: 1.25,
  });

  const hstroke = new Stroke({
    color: '#00f2ff',
    width: 1.25,
  });

  const cstyle = new Style({
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: 5,
    }),
    zIndex: 100,
    fill: fill,
    stroke: stroke,
  });

  const highlight = new Style({
    image: new Circle({
      fill: hfill,
      stroke: hstroke,
      radius: 12,
    }),
    zIndex: 500,
    fill: hfill,
    stroke: hstroke,
  });

  const vectorRef = React.useRef() as React.RefObject<RLayerVector>;

  const loader = (
    <div className="GeoPanoramaPage__canvas-item-2">
      <GeoLoader />
    </div>
  );

  if (loading) {
    return loader;
  }

  return (
    <React.Fragment>
      <RMap className="GeoPanoramaPage__canvas-item-2" initial={{ center: [4336614.6707, 5628297.689], zoom: 15 }}>
        <ROSM />
        {points && (
          <RLayerVector ref={vectorRef}>
            {points &&
              points?.map((f) => {
                console.log('Фильтруем записи', f, selected);
                if (selected && f.values_.id === selected.num) {
                  console.log('Выбранная запись');
                  return (
                    <RFeature
                      key={f?.id}
                      feature={f}
                      style={highlight}
                      onClick={(e: RFeatureUIEvent) => {
                        onFeatureClick(e.target);
                        // e.target.setStyle(highlight);
                        // selected?.setStyle();
                        // setSelected(e.target);
                        e.map.getView().fit(e.target.getGeometry().getExtent(), {
                          duration: 250,
                          maxZoom: 15,
                        });
                        return false;
                      }}
                    />
                  );
                } else {
                  return (
                    <RFeature
                      key={f?.id}
                      feature={f}
                      style={cstyle}
                      onClick={(e: RFeatureUIEvent) => {
                        onFeatureClick(e.target);
                        // e.target.setStyle(highlight);
                        // selected?.setStyle();
                        // setSelected(e.target);
                        e.map.getView().fit(e.target.getGeometry().getExtent(), {
                          duration: 250,
                          maxZoom: 15,
                        });
                        return false;
                      }}
                    />
                  );
                }
              })}
          </RLayerVector>
        )}
      </RMap>
    </React.Fragment>
  );
};

export default GeoPanoramaMap;
