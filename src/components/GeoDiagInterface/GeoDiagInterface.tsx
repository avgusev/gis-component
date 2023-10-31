import React, { useEffect, useState, createContext } from 'react';
import GeoDiagInterfaceHeader from './GeoDiagInterfaceHeader/GeoDiagInterfaceHeader';
import GeoDiagInterfaceSidebar from './GeoDiagInterfaceSidebar/GeoDiagInterfaceSidebar';
import { GeoDiagInterfaceProps } from './GeoDiagInterface.types';
import { gisapiSchemaHeader, pgApiUrl } from '../../config/constants';
import axios from 'axios';
import GeoInterfaceSheet from './GeoInterfaceSheet/GeoInterfaceSheet';
import './GeoDiagInterface.scss';
import GeoDiagInterfaceTable from './GeoDiagInterfaceTable/GeoDiagInterfaceTable';
import PanoramaTable from '../GeoDiagnosticControlModal/PanoramaTable/PanoramaTable';
import LidarTable from '../GeoDiagnosticControlModal/LidarTable/LidarTable';
import DiagDetailsForm from '../GeoDiagnosticControlModal/DiagDetailsForm/DiagDetailsForm';
import { useAppSelector } from '../../config/store';
import DiagDetailsCard from '../GeoDiagnosticControlModal/DiagDetailsForm/DiagDetailsCard/DiagDetailsCard';
import { getObjectAccessLevel } from '../../Map/mapFunctions';
import { UserAccessLevelContext } from './userAccessLevelContext';

export interface selectedTypeInterface {
  code: string;
  id: null | number;
  name: string;
  src_table: null | string;
}

const GeoDiagInterface = ({ roadId, selectedFeature }: GeoDiagInterfaceProps) => {
  //   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [roadName, setRoadName] = useState<string>('');
  const [selectedType, setSelectedType] = useState<selectedTypeInterface>({
    code: 'roadPass',
    id: null,
    name: 'Паспорт дороги',
    src_table: null,
  });
  const [selectedSheet, setSelectedSheet] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const selected = useAppSelector((state) => state.roadPass.selected);

  const userAuth: any = useAppSelector((state) => state.user.userAuthData);
  const [accessLevel, setAccessLevel] = useState<any>(null);

  useEffect(() => {
    if (userAuth && userAuth !== 'anonymous' && Object.keys(userAuth).length > 0 && userAuth?.profile?.userId !== '' && roadId) {
      getObjectAccessLevel(roadId, userAuth?.profile?.userId)
        .then((response) => {
          setAccessLevel(response);
        })
        .catch((error) => {
          console.error(`Ошибка при запросе уровня доступа пользователя! ${error}`);
        });
    }
  }, [userAuth, roadId]);

  const getRoadName = async (roadid) => {
    try {
      const obj = {
        p_road_id: roadid,
      };
      const response = await axios.post(`${pgApiUrl}/rpc/get_road_name`, obj, gisapiSchemaHeader);
      if (response?.data) {
        setRoadName(response?.data);
      }
    } catch (error) {
      console.error('Ошибка при получении имени дороги', error);
    }
  };

  useEffect(() => {
    if (roadId) getRoadName(roadId);
  }, [roadId]);

  useEffect(() => {
    setSelectedSheet(null);
    setIsCreateMode(false);
  }, [selectedType]);

  return (
    <UserAccessLevelContext.Provider value={accessLevel}>
      <div className="GeoDiagInterface__container">
        <div className={`${isSidebarOpen ? 'GeoDiagInterface__container__f-col' : 'GeoDiagInterface__container__f-col--close'}`}>
          <GeoDiagInterfaceSidebar
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
        <div className={`${isSidebarOpen ? 'GeoDiagInterface__container__s-col' : 'GeoDiagInterface__container__s-col--only-one'}`}>
          <GeoDiagInterfaceHeader
            setIsHeaderOpen={setIsHeaderOpen}
            setIsCreateMode={setIsCreateMode}
            isCreateMode={isCreateMode}
            isHeaderOpen={isHeaderOpen}
            roadId={roadId}
            selectedType={selectedType}
            roadName={roadName}
            addClass={isSidebarOpen ? '' : 'GeoDiagInterfaceHeader__header--no-sidebar'}
          />
          <div className={`GeoDiagInterface__container__scroll ${isHeaderOpen ? '' : 'GeoDiagInterface__container__scroll--only-one'}`}>
            {selectedType?.code === 'roadPass' ? (
              <>
                {selected && (
                  <div className="m-4">
                    {' '}
                    {isEditMode ? (
                      <DiagDetailsForm
                        setIsCreateMode={setIsCreateMode}
                        createMode={isCreateMode}
                        idRoad={roadId}
                        setIsEditMode={setIsEditMode}
                      />
                    ) : (
                      <DiagDetailsCard roadName={roadName} setIsEditMode={setIsEditMode} />
                    )}
                  </div>
                )}{' '}
                {isCreateMode && !selected && (
                  <div className="m-4">
                    <DiagDetailsForm
                      setIsCreateMode={setIsCreateMode}
                      createMode={isCreateMode}
                      idRoad={roadId}
                      setIsEditMode={setIsEditMode}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                {selectedType?.code !== 'PANO' && selectedType?.code !== 'LIDAR' && (
                  <div>
                    <GeoInterfaceSheet
                      selectedType={selectedType}
                      selectedSheet={selectedSheet}
                      setSelectedSheet={setSelectedSheet}
                      isRefresh={isRefresh}
                      setIsRefresh={setIsRefresh}
                    />
                    <hr />
                  </div>
                )}
                {selectedType?.src_table && ( //&& selectedTableDescription && (
                  <GeoDiagInterfaceTable
                    selectedType={selectedType}
                    isRefresh={isRefresh}
                    setIsRefresh={setIsRefresh}
                    sheetId={selectedSheet?.id}
                  />
                )}
                {selectedType?.code === 'PANO' && (
                  <div className="mt-5 mb-5 me-4 ms-4">
                    <PanoramaTable idRoad={roadId} idPart={selectedFeature?.road_part_id} />
                  </div>
                )}
                {selectedType?.code === 'LIDAR' && (
                  <div className="mt-5 mb-5 me-4 ms-4">
                    <LidarTable idRoad={roadId} idPart={selectedFeature?.road_part_id} />
                  </div>
                )}
              </>
            )}
          </div>
          {/* <GeoDiagInterfaceFooter /> */}
        </div>
      </div>
    </UserAccessLevelContext.Provider>
  );
};

export default GeoDiagInterface;
