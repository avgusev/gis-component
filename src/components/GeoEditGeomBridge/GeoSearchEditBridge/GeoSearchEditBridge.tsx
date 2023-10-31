import React, { FC, memo, useRef, useState } from 'react';
import GeoSearchInput from '../../GeoSearchInput/GeoSearchInput';
import './GeoSearchEditBridge.scss';
import { GeoSearchEditBridgeTypes } from './GeoSearchEditBridge.types';
import { toast } from 'react-toastify';
import axios from 'axios';
import GeoLoader from '../../GeoLoader/GeoLoader';
import { Card, Form } from 'react-bootstrap';
import { pgApiUrl, publicSchemaHeader } from '../../../config/constants';

interface selectedRoad {
  out_entity_id: number;
  out_full_name: string;
}

const GeoSearchEditBridge: FC<GeoSearchEditBridgeTypes> = ({ selectedBridge, setSelectedBridge }) => {
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
          ENTITY_CODE: 890,
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
          toast.error(`Ошибка при поиске моста! ${error?.response?.data?.message ? error.response.data.message : error}`);
          console.log(error);
        }
      });
  };

  return (
    <div>
      <Form.Control
        type="search"
        placeholder="Поиск по мостам"
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
      />
      {isSearchSelectOpen && searchStr.length > 0 && (
        <div style={{}} className="skdf-shadow-down-12dp GeoSearchEditBridge__search_result ">
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
                    className="GeoSearchEditBridge__content"
                    onMouseDown={() => {
                      setSelectedBridge({
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
            <div className="GeoSearchEditBridge__nocontent">Ничего не найдено...</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GeoSearchEditBridge;
