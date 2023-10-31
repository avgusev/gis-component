import React from 'react';
import { GeoLoaderTypes } from './GeoLoader.types';

const GeoLoader = ({ size, color = '#0d47a1' }: GeoLoaderTypes) => {
  return (
    <div style={{ display: 'inline-flex', color: color || 'currentColor', animation: 'spinAround 0.75s linear infinite' }}>
      <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 3C12 2.44772 11.5511 1.99482 11.0016 2.04995C8.98121 2.25264 7.06154 3.06697 5.50552 4.39594C3.69497 5.9423 2.49559 8.08394 2.12312 10.4357C1.75064 12.7874 2.22951 15.1948 3.4736 17.225C4.71768 19.2551 6.64534 20.7748 8.90983 21.5106C11.1743 22.2463 13.627 22.15 15.8268 21.2388C18.0266 20.3276 19.8291 18.6614 20.9101 16.5399C21.991 14.4184 22.2795 11.9808 21.7237 9.66555C21.246 7.67578 20.1716 5.88862 18.6562 4.53708C18.244 4.16947 17.6147 4.27204 17.2901 4.71885C16.9654 5.16566 17.0697 5.78684 17.4725 6.16464C18.6071 7.22861 19.4125 8.606 19.779 10.1324C20.2236 11.9846 19.9928 13.9347 19.1281 15.6319C18.2633 17.3291 16.8213 18.6621 15.0615 19.391C13.3016 20.12 11.3395 20.1971 9.52786 19.6085C7.71627 19.0198 6.17415 17.8041 5.17888 16.18C4.18361 14.5559 3.80051 12.6299 4.09849 10.7485C4.39647 8.86715 5.35598 7.15384 6.80442 5.91675C7.99811 4.89724 9.45931 4.25632 11.0026 4.06241C11.5505 3.99355 12 3.55228 12 3Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default GeoLoader;
