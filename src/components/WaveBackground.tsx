import React from 'react';

export const WaveBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800">
        <div className="absolute bottom-0 left-0 right-0 h-48">
          <div className="absolute w-[400%] h-full animate-wave">
            <svg 
              className="absolute bottom-0 w-full h-full" 
              viewBox="0 0 2880 320" 
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fill="#0066CC" 
                fillOpacity="0.2" 
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};