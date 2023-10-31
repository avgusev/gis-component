import React, { useContext } from 'react';
import { format } from 'date-fns';
import { useAppSelector } from '../../../../config/store';
import GeoIconButton from '../../../GeoIconButton/GeoIconButton';
import './detailsCard.scss';
import { UserAccessLevelContext } from '../../../GeoDiagInterface/userAccessLevelContext';

interface DiagDetailsCardProps {
  roadName?: string;
  setIsEditMode: (val: boolean) => void;
}

const DiagDetailsCard = (props: DiagDetailsCardProps) => {
  const { roadName, setIsEditMode } = props;
  const userAccessLevel = useContext(UserAccessLevelContext);

  const selected = useAppSelector((state) => state.roadPass.selected);
  return (
    <>
      <h3>{selected.doc_name}</h3>
      {userAccessLevel && userAccessLevel === 2 && (
        <GeoIconButton
          iconType="cog"
          classes="mb-4 mt-3 DiagDetailsCard__item__btn"
          content="Редактировать"
          isTransparent
          handleClick={() => {
            setIsEditMode(true);
          }}
        />
      )}
      <div className="mb-3">
        <div className="DiagDetailsCard__item__title">{'Дорога'}</div>
        <div className="DiagDetailsCard__item__text">{roadName}</div>
      </div>
      <div className="mb-3">
        <div className="DiagDetailsCard__item__title">{'Направление'}</div>
        <div className="DiagDetailsCard__item__text">{selected.part_name}</div>
      </div>
      <div className="mb-3">
        <div className="DiagDetailsCard__item__title">{'Заказчик'}</div>
        <div className="DiagDetailsCard__item__text">{selected.diag_customer_name}</div>
      </div>
      <div className="mb-3">
        <div className="DiagDetailsCard__item__title">{'Подрядчик'}</div>
        <div className="DiagDetailsCard__item__text">{selected.diag_provider_name}</div>
      </div>
      <div className="mb-3">
        <div className="DiagDetailsCard__item__title">{'Дата начала'}</div>
        <div className="DiagDetailsCard__item__text">{format(new Date(selected.diag_beg_date), 'dd.MM.yyyy')}</div>
      </div>
      <div className="mb-3">
        <div className="DiagDetailsCard__item__title">{'Дата окончания'}</div>
        <div className="DiagDetailsCard__item__text">{format(new Date(selected.diag_end_date), 'dd.MM.yyyy')}</div>
      </div>
    </>
  );
};

export default DiagDetailsCard;
