import React, { FC, memo, useRef, useState } from 'react';
import GeoSearchInput from '../../GeoSearchInput/GeoSearchInput';
import './GeoSearchRoads.scss';
import { GeoSearchRoadsTypes } from './GeoSearchRoads.types';
import { toast } from 'react-toastify';
import axios from 'axios';
import GeoLoader from '../../GeoLoader/GeoLoader';
import { Card, Form } from 'react-bootstrap';
import { pgApiUrl, publicSchemaHeader } from '../../../config/constants';

interface selectedRoad {
  out_entity_id: number;
  out_full_name: string;
}

const GeoSearchRoads: FC<GeoSearchRoadsTypes> = ({ routerRest, isSearchingFeature, setIsSearchingFeature, setSearchStr, searchStr }) => {
  // const [searchStr, setSearchStr] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchSelectOpen, setIsSearchSelectOpen] = useState<boolean>(false);
  const [roads, setRoads] = useState<any[]>([]);
  const [selectedRoad, setSelectedRoad] = useState<selectedRoad | null>(null);

  const cancelToken = useRef<any>();
  const controller = useRef<any>();

  const searchRoads = (str) => {
    setIsSearching(true);
    // if (cancelToken?.current && typeof cancelToken.current != typeof undefined) {
    //   ;
    //   cancelToken.current.cancel('Operation canceled due to new request.');
    // }
    // cancelToken.current = axios.CancelToken.source();

    const obj = {
      p_params: {
        FILTER: {
          ENTITY_CODE: 4,
          TEXT_SEARCH: str,
        },
        PAGING: {
          START_POSITION: 0,
          LIMIT_ROWS: 10,
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
      //cancelToken: cancelToken.current.token,
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
    //controller.abort();
  };

  return (
    <div>
      <Form.Control
        type="search"
        // size="sm"
        // value={filterValue}
        placeholder="Поиск по дорогам"
        onFocus={(e) => {
          setIsSearchSelectOpen(true);
        }}
        onBlur={(e) => {
          setIsSearchSelectOpen(false);
        }}
        value={searchStr}
        onChange={(e) => {
          setSearchStr(e.target.value);
          if (e.target.value === '') {
            setRoads([]);
          } else {
            searchRoads(e.target.value);
          }
        }}
      />
      {/* <input
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
        className="GeoSearch__input form-control form-control-sm"
        type="search"
        placeholder="Поиск по дорогам"
      /> */}
      {isSearchingFeature && (
        <div className="GeoSearchRoads__searching">
          Выполняется поиск выбранного объекта... <GeoLoader />
        </div>
      )}
      {isSearchSelectOpen && searchStr.length > 0 && (
        <div style={{}} className="skdf-shadow-down-12dp GeoSearchRoads__search_result ">
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
                    className="GeoSearchRoads__content"
                    onMouseDown={() => {
                      setIsSearchingFeature(true);
                      setSelectedRoad({
                        out_entity_id: item.out_entity_id,
                        out_full_name: item.out_full_name,
                      });
                      routerRest.history.push({ pathname: `/map/road/${item.out_entity_id}`, state: 'map' });
                      setIsSearchSelectOpen(false);
                      // setIsSearchSelectOpen((state) => {
                      //   routerRest.history.push({ pathname: `/map/${item.out_entity_id}`, state: undefined });
                      //   return false;
                      // });
                    }}
                  >
                    {item.out_full_name}
                  </div>
                );
              })}
            </div>
          ) : !isSearching ? (
            <div className="GeoSearchRoads__nocontent">Ничего не найдено...</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GeoSearchRoads;
