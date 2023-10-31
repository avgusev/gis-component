import React, { FC, memo, useRef, useState } from 'react';
import GeoSearchInput from '../../GeoSearchInput/GeoSearchInput';
import './GeoSearchEditRoads.scss';
import { GeoSearchEditRoadsTypes } from './GeoSearchEditRoads.types';
import { toast } from 'react-toastify';
import axios from 'axios';
import GeoLoader from '../../GeoLoader/GeoLoader';
import { Card, Form } from 'react-bootstrap';
import { pgApiUrl, publicSchemaHeader } from '../../../config/constants';

interface selectedRoad {
  out_entity_id: number;
  out_full_name: string;
}

const GeoSearchEditRoads: FC<GeoSearchEditRoadsTypes> = ({ selectedRoad, setSelectedRoad }) => {
  const [searchStr, setSearchStr] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchSelectOpen, setIsSearchSelectOpen] = useState<boolean>(true);
  const [roads, setRoads] = useState<any[]>(['']);

  const controller = useRef<any>();

  const searchRoads = (str) => {
    setIsSearching(true);
    const obj = {
      p_params: {
        FILTER: {
          ENTITY_CODE: 4,
          TEXT_SEARCH: str,
        },
        PAGING: {
          START_POSITION: 0,
          LIMIT_ROWS: 20,
        },
      },
    };
    if (controller?.current && typeof controller !== typeof undefined) {
      controller?.current.abort();
    }
    controller.current = new AbortController();
    const configAxios = {
      url: `${pgApiUrl}/rpc/get_entity_list`,
      method: 'post',
      data: obj,
      withCredentials: true,
      onUploadProgress: console.log,
      headers: publicSchemaHeader?.headers,
      signal: controller?.current?.signal,
    };
    axios(configAxios)
      .then((response) => {
        setRoads(response.data);
        setIsSearching(false);
      })
      .catch((error: any) => {
        if (error?.code !== 'ERR_CANCELED') {
          setIsSearching(false);
          toast.error(`Ошибка при поиске дорог! ${error?.response?.data?.message ? error.response.data.message : error}`);
          console.log(error);
        }
      });
  };

  return (
    <div>
      <Form.Control
        type="search"
        placeholder="Поиск по дорогам"
        onFocus={(e) => {
          setIsSearchSelectOpen(true);
        }}
        onBlur={(e) => {
          setIsSearchSelectOpen(false);
        }}
        onChange={(e) => {
          setSearchStr(e.target.value);
          if (e.target.value === '') {
            setRoads([]);
          } else {
            searchRoads(e.target.value);
          }
        }}
        //value={selectedRoad?.out_full_name}
      />
      {/* {isSearchingFeature && (
        <div className="GeoSearchEditRoads__searching">
          Выполняется поиск выбранной дороги... <GeoLoader />
        </div>
      )} */}
      {isSearchSelectOpen && searchStr.length > 0 && (
        <div style={{}} className="skdf-shadow-down-12dp GeoSearchEditRoads__search_result ">
          {isSearching && (
            <div style={{ color: '#0D47A1', textAlign: 'center', marginTop: '10px' }}>
              <GeoLoader />
            </div>
          )}
          {roads && roads.length > 0 && !isSearching ? (
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Результат поиска:</div>
              {roads.map((item) => {
                return (
                  <div
                    key={item?.out_entity_id}
                    className="GeoSearchEditRoads__content"
                    onMouseDown={() => {
                      // setIsSearchingFeature(true);
                      setSelectedRoad({
                        out_entity_id: item.out_entity_id,
                        out_full_name: item.out_full_name,
                      });
                      setIsSearchSelectOpen(false);
                    }}
                  >
                    {item.out_full_name}
                  </div>
                );
              })}
            </div>
          ) : !isSearching ? (
            <div className="GeoSearchEditRoads__nocontent">Ничего не найдено...</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GeoSearchEditRoads;
