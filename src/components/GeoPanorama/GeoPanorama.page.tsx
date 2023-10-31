import React from 'react';
import axios from 'axios';
import { ApplicationModes } from '../../config/constants';
import GeoLoader from '../GeoLoader/GeoLoader';
import { GeoPanorama } from './GeoPanorama';
import './GeoPanorama.page.scss';
import { GeoPanoramaMap } from './GeoPanoramaMap';

export type GeoPanoramaPageTypes = {
  roadId: number;
  diagId: number;
  s3Url: string;
  backUrl: string;
  year: number;
};

export const GeoPanoramaPage = ({ roadId, diagId, s3Url, backUrl, year }: GeoPanoramaPageTypes) => {
  const [features, setFeatures] = React.useState<any[]>();
  const [selected, setSelected] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [url, setUrl] = React.useState<string>();
  const diagSchemaHeaders = { headers: { 'Content-Profile': 'diag' } };

  React.useEffect(() => {
    console.log(
      `В компонету GeoPanoramaPage пришли следующие переменные: roadId=${roadId} diagId=${diagId} backUrl=${backUrl} year=${year}`
    );
    try {
      axios.post(`${backUrl}/rpc/get_pano_ref_as_json`, { p_sheet_id: 39, p_step: 100 }, diagSchemaHeaders).then((response) => {
        console.log('Запрос метода get_pano_ref_as_json вернул', response);
        if (response.data !== null) {
          console.info('Загружены следующие сущности', response.data);
          console.info('Первая сущность загружена', response.data[0]);
          setFeatures(response.data);
          setSelected(response.data[0]);
          setUrl(`${s3Url}/${roadId}/${year}/${diagId}/pano_000000_000000.jpg`);
          setLoading(false);
        }
      });
    } catch (e) {
      console.log('Ошибка в компонете GeoPanoramaPage', e);
    }
  }, []);

  if (!loading) {
    console.log('Выбранный элемент', selected);
    return (
      <div className="GeoPanoramaPage__container">
        <GeoPanorama
          url={url}
          selected={selected}
          onClose={function (mode: ApplicationModes): void {
            throw new Error('Function not implemented.');
          }}
          updateMapSize={function (): void {
            throw new Error('Function not implemented.');
          }}
          onUpClick={function (): void {
            const currentIndex = features.indexOf(selected);
            const nextIndex = (currentIndex + 1) % features.length;
            if (features[nextIndex]) {
              setSelected(features[nextIndex]);
              setUrl(`${s3Url}/${roadId}/${year}/${diagId}/${features[nextIndex].pano}.jpg`);
            }
          }}
          onDownClick={function (): void {
            const currentIndex = features.indexOf(selected);
            const prevIndex = (currentIndex - 1) % features.length;
            if (features[prevIndex]) {
              setSelected(features[prevIndex]);
              setUrl(`${s3Url}/${roadId}/${year}/${diagId}/${features[prevIndex].pano}.jpg`);
            }
          }}
        />
        <GeoPanoramaMap
          roadId={roadId}
          selected={selected}
          year={year}
          diagId={diagId}
          onFeatureClick={function (e: any): void {
            console.log('onFeatureClick Fired!', e, e.values_.name);
            setSelected(e.values_.properties.f);
            setUrl(`${s3Url}/${roadId}/${year}/${diagId}/${e.values_.name}.jpg`);
            return;
          }}
          features={features}
        />
      </div>
    );
  }

  return (
    <div className="GeoPanoramaPage__container">
      <GeoLoader />
    </div>
  );
};

export default GeoPanoramaPage;
