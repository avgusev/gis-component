import { selectedTypeInterface } from '../GeoDiagInterface';

export interface GeoDiagInterfaceSidebarProps {
  // isOpen?: boolean;
  // open?: (isOpen: boolean) => void;
  selectedType?: selectedTypeInterface | null;
  setSelectedType?: any;
  setIsSidebarOpen: (val: boolean) => void;
  isSidebarOpen: boolean;
}
