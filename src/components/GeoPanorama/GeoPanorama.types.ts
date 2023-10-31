import { ApplicationModes } from '../../config/constants';

export interface GeoPanoramaTypes {
  url: string;
  onClose: (mode: ApplicationModes) => void;
  updateMapSize: () => void;
  onUpClick: () => void;
  onDownClick: () => void;
  selected: any;
}
