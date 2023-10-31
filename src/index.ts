// import GeoIconButton from './components/GeoIconButton';
// import GeoLayersSwitcher from './components/GeoLayersSwitcher';
import MapContainer from './Map/MapContainer';
import MapPassport from './MapPassport/MapPassport';
import StatForms from './StatForms/StatForms';
import StatFormList from './components/GeoStatForms/StatFormList/StatFormList';
// import GeoFilters from './components/GeoFilters';
// import GeoUpButtonsBar from './components/GeoUpButtonsBar';
// import GeoMapCardDetail from './components/GeoMapCardDetail';
// import GeoSideBar from './components/GeoSideBar';
import axios from 'axios';
import './ol.scss';
import './main.scss';

axios.defaults.headers['Access-Control-Allow-Origin'] = '*';

export {
  // GeoIconButton, GeoLayersSwitcher, GeoFilters, GeoUpButtonsBar,
  MapContainer,
  MapPassport,
  StatForms,
  StatFormList,
  // GeoMapCardDetail, GeoSideBar
};
