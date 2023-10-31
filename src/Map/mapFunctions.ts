import axios from 'axios';
import { pgApiSkdfUrl, pgApiUrl, querySchemaHeader } from '../config/constants';

export const getObjectAccessLevel = async (entityId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const obj = {
        p_user_id: Number(userId),
        p_entity_id: Number(entityId),
      };

      //const response = await axios.post(`${pgApiSkdfUrl}/rpc/get_user_access_level`, obj, querySchemaHeader);
      const response = await axios.post(`${pgApiUrl}/rpc/get_user_access_level`, obj, querySchemaHeader);
      if (response?.data) {
        resolve(response?.data);
      }
      resolve(null);
    } catch (error) {
      reject(error);
      console.error('Ошибка при проверки полномочий пользователя на выбранный объект!', error);
    }
  });
};
