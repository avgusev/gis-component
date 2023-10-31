export interface GeoTabsProps {
  isDisable?: boolean;
  activeTab: 'lidar' | 'panorama' | 'diag_details';
  setActiveTab: (value: 'lidar' | 'panorama' | 'diag_details') => void;
}
