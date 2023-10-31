import React, { useState, useEffect, FC } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import MapComponent from './MapComponent';
import './MapContainer.scss';
import geojson from './geojson.mock';
import { MapContainerTypes } from './MapContainer.types';
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import getStore, { useAppDispatch, useAppSelector } from '../config/store';
import { Provider } from 'react-redux';
import { setUserAuth } from '../reducers/userAuth.reducer';
import axios from 'axios';
import { pgApiUrl, gisSchemaHeader } from '../config/constants';

const MapContainer: FC<MapContainerTypes> = ({ geoserverUrl, backendUrl, routerRest, userAuth, panoramaUrl, lidarUrl }) => {
  //console.log(routerRest?.match?.params?.id);
  // const location = useLocation();
  // const navigate = useNavigate();
  // const params = useParams();
  // const history = {
  //   push({ pathname }: { pathname: string }) {
  //     navigate(pathname);
  //   },
  // };
  // const [test64, setTest64] = useState<bigint>(null);

  // const getTestData = () => {
  //   axios
  //     .get(`${pgApiUrl}/v_test_64`, gisSchemaHeader)
  //     .then((response) => {
  //       debugger;
  //       if (response?.data && response?.data.length > 0) {
  //         const resnumber = response?.data?.[0]?.int8;
  //         const bigint = BigInt(resnumber);
  //         const numberArray = new BigInt64Array([BigInt(resnumber)]);
  //         console.log(resnumber, bigint, numberArray);
  //         debugger;
  //         numberArray.forEach((item, index) => {
  //           console.log(`Порядок ${index}: ${item}`);
  //         });
  //         setTest64(resnumber);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Ошибка при получении данных! ', error);
  //     });
  // };

  const [features, setFeatures] = useState([]);
  const store = getStore();
  console.log(store);

  useEffect(() => {
    const wktOptions = {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    };
    const parsedFeatures: any = new GeoJSON().readFeatures(geojson, wktOptions);
    setFeatures(parsedFeatures);
    //getTestData();
  }, []);

  const style = { '--toastify-color-info': '#3467b4', '--toastify-text-color-info': '#fff' } as React.CSSProperties;

  return (
    <Provider store={store}>
      <div className="mapContainer scrollbar scrollbar-primary-table">
        <div style={style}>
          <ToastContainer
            theme="colored"
            position="bottom-right"
            icon={false}
            closeButton={
              <svg width="24" height="24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.2929 5.29289C5.68342 4.90237 6.31659 4.90237 6.70711 5.29289L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L5.2929 6.70711C4.90238 6.31658 4.90238 5.68342 5.2929 5.29289Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L5.29288 17.2929C4.90236 17.6834 4.90236 18.3166 5.29288 18.7071C5.6834 19.0976 6.31657 19.0976 6.70709 18.7071L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289Z"
                  fill="currentColor"
                />
              </svg>
            }
          />
        </div>

        {/* <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /> */}
        <MapComponent features={features} routerRest={routerRest} userAuth={userAuth} lidarUrl={lidarUrl} panoramaUrl={panoramaUrl} />
      </div>
    </Provider>
  );
};

export default MapContainer;
