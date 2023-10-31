export interface DiagDetailsFormProps {
  roadName?: string;
  createMode: boolean;
  idRoad: number;
  setIsCreateMode: (value: boolean) => void;
  setIsEditMode?: (value: boolean) => void;
}
