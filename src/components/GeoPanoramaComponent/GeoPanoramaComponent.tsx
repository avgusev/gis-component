import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe';
import { diagSchemaHeaders, pgApiUrl } from '../../config/constants';
import GeoLoader from "../GeoLoader/GeoLoader";

export type GeoPanoramaComponentType = {
  url: string;
  roadId: string;
};

export const GeoPanoramaComponent = ({ url, roadId }: GeoPanoramaComponentType) => {

  const [passportId, setPassportId] = useState<number>();
  const [sheetId, setSheetId] = useState<number>();

  useEffect(() => {
    if (roadId) {
      try {
        axios
          .post(`${pgApiUrl}/rpc/get_last_pano_path`, { p_road_id: roadId }, diagSchemaHeaders)
          .then((response) => {
            if (response.data) {
              const res = response.data.split('/');
              setPassportId(res[1]);
              setSheetId(res[2]);
            }
          })
          .catch((error) => {
            console.error(`Ошибка получении данных PANO по дороге ${roadId}: ${error}`);
          });
      }
      catch (error) {
        console.error(`Ошибка получении данных PANO по дороге ${roadId}: ${error}`)
      }
    }
  }, [roadId]);

  if (roadId && sheetId && passportId) {
    return (
      <Iframe
        url={`${url}?roadId=${roadId}&passportId=${passportId}&sheetId=${sheetId}`}
        width="100%"
        height="100%"
        className=""
        display="block"
        position="absolute"
      />
    )
  }

  return (<GeoLoader/>);
};

export default GeoPanoramaComponent;
