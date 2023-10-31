import { bridgeObjType } from './../../../global.types';
type formModeType = 'create' | 'edit' | 'show';

export interface GeoBridgeFormProps {
  formMode: formModeType;
  setFormData: (value: bridgeObjType) => void;
  formData: bridgeObjType;
  setBridgeFormMode: (value: formModeType) => void;
}
