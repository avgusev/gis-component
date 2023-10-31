import { useEffect } from '@storybook/addons';
import React, { useContext, useState } from 'react';
import { userAccessContext } from '../userAccessContext';
import { formMetaData } from './formsMetaData.mock';
import { StatFormPageTypes } from './StatFormPage.types';
import StatFormPageHeader from './StatFormPageHeader/StatFormPageHeader';
import StatFormPageTable from './StatFormPageTable/StatFormPageTable';
import { statFormMetaMock } from './StatFormPageTable/table_template';

const mockData = {
  title: 'Мониторинг Республики Мордовия 1 квартал 2019 г.',
  status: 'Проект',
  deliveryTime: '10.05.23',
};

const StatFormPage = ({ routerRest }: StatFormPageTypes) => {
  const [metaData, setMetaData] = useState<any>(formMetaData['1-fd']['chapter1']);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const userAccessLevel = useContext(userAccessContext);

  // const getMetaData = (formCode, reportId) => {
  //   try {
  //     setMetaData(formMetaData['1-fd']['chapter1']);
  //   } catch (error) {
  //     console.log('Ошибка при получении ');
  //   }
  // };

  // useEffect(() => {
  //   if (routerRest?.match?.params?.code && routerRest?.match?.params?.report_id) {
  //     getMetaData(routerRest?.match?.params?.code, routerRest?.match?.params?.report_id);
  //   }
  // }, [routerRest?.match?.params]);

  return (
    <div className="p-4">
      <StatFormPageHeader status={mockData.status} deliveryTime={mockData.deliveryTime} title={mockData.title} routerRest={routerRest} />
      <StatFormPageTable
        // routerRest={routerRest}
        metaData={metaData}
      />
    </div>
  );
};

export default StatFormPage;
