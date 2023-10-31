import React, { useState, useEffect } from 'react';
import StatFormListHeader from './StatFormListHeader.tsx/StatFormListHeader';
import StatFormListTable from './StatFormListTable/StatFormListTable';
import StatFormPage from '../StatFormPage/StatFormPage';
import { StatFormListTypes } from './StatFormList.types';
import { userAccessContext } from '../userAccessContext';
import axios from 'axios';
import { pgApiUrl } from '../../../config/constants';
import getStore, { useAppDispatch, useAppSelector } from '../../../config/store';
import { setUserAuth } from '../../../reducers/userAuth.reducer';

import { Provider } from 'react-redux';
import { setFormCode } from '../../../reducers/statForm.reducer';

const mock = {
  title: 'Мониторинг',
  deliveryTime: '10.05.2023',
  reportsNum: 215,
};

const StatFormListComponent = ({ routerRest, userAuth }: StatFormListTypes) => {
  const dispatch = useAppDispatch();
  const [isStatPage, setIsStatPage] = useState<boolean>(false);
  const [accessLevel, setAccessLevel] = useState<number>(0);
  const [reportFormList, setReportFormList] = useState<any>(null);

  const formCode: any = useAppSelector((state) => state.statForm.selectedFormCode);
  //const userAuth: any = useAppSelector((state) => state.user.userAuthData);
  //const dispatch = useAppDispatch();

  const getReportFormList = async (code) => {
    try {
      //Получение перечня отчетов по коду формы
      // const response = await axios.post(`${pgApiUrl}/rpc/f_get_work_photos`, { code: code}, "schema");
      // if (response?.data && response?.data.length) {
      //   setReportFormList(response?.data);
      // }
    } catch (error) {
      console.log('Ошибка при получении списка отчетов! ', error);
    }
  };

  const getAccesLevel = async (userId) => {
    try {
      //Получение уровня доступа пользователя
      // const response = await axios.post(`${pgApiUrl}/rpc/get_access_level`, { user_id: userId}, "schema");
      // if (response?.data && response?.data.length) {
      //   setAccessLevel(response?.data);
      // }
    } catch (error) {
      console.log('Ошибка при уровня доступа пользователя! ', error);
    }
  };

  useEffect(() => {
    if (routerRest?.match?.params?.code && !routerRest?.match?.params?.report_id) {
      dispatch(setFormCode(routerRest?.match?.params?.code));
      if (isStatPage) setIsStatPage(false);
    }
  }, [routerRest?.match?.params?.code, routerRest?.match?.params?.report_id]);

  useEffect(() => {
    if (routerRest?.match?.params?.report_id) {
      setIsStatPage(true);
    }
  }, [routerRest?.match?.params?.report_id]);

  // useEffect(() => {
  //   if (userAuth && userAuth !== null) dispatch(setUserAuth(userAuth));
  //   if (userAuth?.profile?.userId) getAccesLevel(userAuth?.profile?.userId);
  // }, [userAuth]);

  return (
    <>
      <userAccessContext.Provider value={accessLevel}>
        {isStatPage ? (
          <StatFormPage routerRest={routerRest} />
        ) : formCode !== '' ? (
          <div className="p-4">
            {/* <StatFormListHeader title={mock.title} deliveryTime={mock.deliveryTime} reportsNum={mock.reportsNum} />{' '} */}
            <StatFormListHeader deliveryTime={mock.deliveryTime} reportsNum={mock.reportsNum} />{' '}
            <StatFormListTable routerRest={routerRest} />
          </div>
        ) : null}
      </userAccessContext.Provider>
    </>
  );
};

const StatFormList = ({ routerRest, userAuth }: StatFormListTypes) => {
  const store = getStore();
  return (
    <Provider store={store}>
      <StatFormListComponent routerRest={routerRest} userAuth={userAuth} />
    </Provider>
  );
};

export default StatFormList;
