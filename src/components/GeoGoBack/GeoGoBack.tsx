import React from 'react';
import './GeoGoBack.scss';

export function GeoGoBack({ href = '', text = '', handleClick }) {
  return (
    <nav>
      <ol className="breadcrumb mb-0 mt-1">
        <li className="breadcrumb-item">
          <div className="GeoGoBackButton" onClick={handleClick}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 4.90931C10 5.2775 9.70152 5.57597 9.33333 5.57597L2.27614 5.57597L5.38071 8.68054C5.64106 8.94089 5.64106 9.363 5.38071 9.62335C5.12036 9.8837 4.69825 9.8837 4.4379 9.62335L0.195262 5.38071C-0.0650879 5.12036 -0.0650879 4.69825 0.195262 4.4379L4.4379 0.195262C4.69825 -0.0650874 5.12036 -0.0650874 5.38071 0.195262C5.64106 0.455612 5.64106 0.877722 5.38071 1.13807L2.27614 4.24264L9.33333 4.24264C9.70152 4.24264 10 4.54112 10 4.90931Z"
                fill="currentColor"
              />
            </svg>
            <span className="ms-2">{text}</span>
          </div>
        </li>
      </ol>
    </nav>
  );
}
