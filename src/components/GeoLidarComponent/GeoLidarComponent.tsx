import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe';
import { diagSchemaHeaders, pgApiUrl, querySchemaHeader } from '../../config/constants';
import GeoLoader from '../GeoLoader/GeoLoader';

export type GeoLidarComponentType = {
  url: string;
  roadId: string;
};

export const GeoLidarComponent = ({ url, roadId }: GeoLidarComponentType) => {
  const [sheetId, setSheetId] = useState<number>();
  const [diagId, setDiagId] = useState<number>();

  useEffect(() => {
    if (roadId) {
      try {
        axios
          //.post(`${pgApiUrl}/rpc/get_last_lidar_path`, { p_road_id: roadId }, diagSchemaHeaders)
          .post(`${pgApiUrl}/rpc/get_last_lidar_path`, { p_road_id: roadId }, querySchemaHeader)
          .then((response) => {
            if (response.data) {
              const res = response.data.split('/');
              setDiagId(res[1]);
              setSheetId(res[2]);
            }
          })
          .catch((error) => {
            console.error(`Ошибка получении данных LIDAR по дороге ${roadId}: ${error}`);
          });
      } catch (error) {
        console.error(`Ошибка получении данных LIDAR по дороге ${roadId}: ${error}`);
      }
    }
  }, [roadId]);

  if (roadId && sheetId && diagId) {
    return (
      <Iframe
        url={`${url}?roadId=${roadId}&diagId=${diagId}&sheetId=${sheetId}`}
        width="100%"
        height="100%"
        className=""
        display="block"
        position="absolute"
      />
    );
  }

  return <GeoLoader />;
};

export default GeoLidarComponent;
