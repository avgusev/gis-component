export interface GeoGalleryModalType {
  isOpen: boolean;
  data: any[];
  open: (isOpen: React.SetStateAction<boolean>) => void;
}
