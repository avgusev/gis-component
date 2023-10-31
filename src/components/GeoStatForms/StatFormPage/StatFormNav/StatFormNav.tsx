import React, { useEffect, useState } from 'react';
import './StatFormNav.scss';
import { reportsList } from '../../StatFormPage/forms.mock';
import { useAppDispatch } from '../../../../config/store';
import { setReportChapter } from '../../../../reducers/statForm.reducer';

const navs = [
  {
    id: 1,
    title: 'Доходы',
    code: 'chapter1',
  },
  {
    id: 2,
    title: 'Расходы',
    code: 'chapter2',
  },
  {
    id: 3,
    title: 'Результаты',
    code: 'chapter3',
  },
  {
    id: 4,
    title: 'Объемы работ',
    code: 'chapter4',
  },
  {
    id: 5,
    title: 'Расчет по нормативам',
    code: 'chapter5',
  },
  {
    id: 6,
    title: 'Расчет по нормативам',
    code: 'chapter6',
  },
  {
    id: 7,
    title: 'Расчет по нормативам',
    code: 'chapter7',
  },
  {
    id: 8,
    title: 'Расчет по нормативам',
    code: 'chapter8',
  },
  {
    id: 9,
    title: 'Расчет по нормативам',
    code: 'chapter9',
  },
  {
    id: 10,
    title: 'Расчет по нормативам',
    code: 'chapter10',
  },
  {
    id: 11,
    title: 'Расчет по нормативам',
    code: 'chapter11',
  },
];

const StatFormNav = ({ routerRest }) => {
  const [currentPill, setCurrentPill] = useState(+routerRest?.match?.params?.chapter_id);
  const [navs, setNavs] = useState([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (routerRest?.match?.params?.report_id) {
      const currentReport = reportsList.find((report) => report.ID === +routerRest?.match?.params?.report_id);
      setCurrentPill(+routerRest?.match?.params?.chapter_id);
      setNavs(currentReport.CHAPTERS);
    }
  }, [routerRest?.match?.params?.report_id]);

  const handleOnClick = (event) => {
    setCurrentPill(+event.currentTarget.dataset.code);
    routerRest.history.push({
      pathname: `/statforms/${routerRest?.match?.params?.code}/${routerRest?.match?.params?.report_id}/${event.currentTarget.dataset.code}`,
      state: undefined,
    });
    dispatch(setReportChapter(event.currentTarget.dataset.code));
  };

  return (
    <nav className="mt-3 nav nav-pills StatFormNav_nav">
      {navs.map((item) => (
        <div
          key={item.ID}
          data-code={item.ID}
          onClick={handleOnClick}
          className={`StatFormNav_pills ${currentPill === +item.ID ? 'StatFormNav_pills--active ' : ''}me-3`}
        >
          {item.LABEL}
        </div>
      ))}
    </nav>
  );
};

export default StatFormNav;
