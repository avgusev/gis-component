import axios from 'axios';
import { skdfApiUrl } from '../config/constants';

export const geoGetCardDetail = async (id, setData) => {
  axios
    .get(`${skdfApiUrl}/api/v1/portal/map/mini-passport/${id}`)
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      console.error(`Ошибка получении данных geoGetCardDetail: ${error}`);
    });
};
