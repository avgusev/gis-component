import { pgApiUrl, commandapiSchemaHeader } from './../config/constants';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import axios from 'axios';

export const getCommandFile = async (sheetId, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await axios.get(`${pgApiUrl}/rpc/get_diag_script?sheet_id=${sheetId}`, commandapiSchemaHeader);
    if (response?.data && response?.data !== null && response?.data !== '') {
      const contentDispositionHeader = response.headers['content-disposition'];
      const fileNameStr = contentDispositionHeader.split('filename=')?.[1];
      const filename = fileNameStr.substring(fileNameStr.indexOf('"') + 1, fileNameStr.lastIndexOf('"'));
      if (filename !== '') {
        const data = new Blob([response?.data], { type: 'text/plain' });
        saveAs(data, filename);
        setIsLoading(false);
      }
    }
  } catch (error) {
    setIsLoading(false);
    console.log(`Ошибка при получении исполняемого файла! ${error}`);
  }
};
