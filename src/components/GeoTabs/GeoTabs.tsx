import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { GeoTabsProps } from './GeoTabs.types';

const GeoTabs = (props: GeoTabsProps) => {
  const { activeTab, setActiveTab, isDisable = false } = props;
  return (
    <Nav
      fill
      variant="tabs"
      defaultActiveKey="diag_details"
      onSelect={(k: 'lidar' | 'panorama' | 'diag_details') => setActiveTab(k)}
      activeKey={activeTab}
    >
      <Nav.Item>
        <Nav.Link disabled={isDisable} eventKey="diag_details">
          Реквизиты диагностики
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link disabled={isDisable} eventKey="lidar">
          Лазерная съемка (LIDAR)
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link disabled={isDisable} eventKey="panorama">
          Панорамная съемка (PANO)
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default GeoTabs;
