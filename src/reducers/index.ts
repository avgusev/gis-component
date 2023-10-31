import region from './region.reducer';
import route from './route.reducer';
import agglomeration from './agglomeration.reducer';
import town from './town.reducer';
import district from './district.reducer';
import city from './city.reducer';
import planingStructure from './planningStructure.reducer';
import coordinate from './coordinate.reducer';
import category from './category.reducer';
import roadclass from './roadClass.reducer';
import worktype from './workType.reducer';
import picket from './picket.reducer';
import preset from './preset.reducer';
import roadworks5y from './roadworks5y.reducer';
import roadwaywidth from './roadwaywidth.reducer';
import traffic from './traffic.reducer';
import skeleton from './skeleton.reducer';
import norm from './norm.reducer';
import loading from './loading.reducer';
import dtp from './dtp.reducer';
import user from './userAuth.reducer';
import mapstate from './map.reducer';
import mapdraw from './mapDraw.reducer';
import filters from './filters.reducer';
import roadvalues from './roadValue.reducer';
import roadPass from './roadPass.reducer';
import statForm from './statForm.reducer';
import mapregskeleton from './mapRegionalSkeleton.reducer';

const rootReducer = {
  filters,
  // Регион
  region,
  // Город
  city,
  // Населенный пункт
  town,
  // Район
  district,
  // Планировочная структура
  planingStructure,
  // Маршрут
  route,
  // Агломерация
  agglomeration,
  // Координаты
  coordinate,
  // Категория
  category,
  // Класс дороги
  roadclass,
  // Тип работ
  worktype,
  roadwaywidth,
  traffic,
  skeleton,
  norm,
  loading,
  dtp,
  user,
  mapstate,
  mapdraw,
  // Поиск пикета дороги
  picket,
  roadworks5y,
  preset,
  roadvalues,
  roadPass,
  mapregskeleton,
  statForm,
};

export default rootReducer;
