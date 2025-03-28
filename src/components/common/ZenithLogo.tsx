
import React from "react";

interface ZenithLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const ZenithLogo: React.FC<ZenithLogoProps> = ({ 
  className = "", 
  width = 40, 
  height = 40 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 400 400" 
      className={className}
      width={width}
      height={height}
    >
      {/* Deep blue Z shape */}
      <path 
        d="M75 120 L285 120 L285 160 L160 280 L285 280 L285 320 L75 320 L75 280 L200 160 L75 160 Z" 
        fill="#003366" 
        rx="5" 
        ry="5" 
        style={{ strokeLinejoin: "round" }}
      />
      
      {/* Green triangle */}
      <path 
        d="M230 65 L285 120 L175 120 Z" 
        fill="#00CC66"
      />
    </svg>
  );
};

export default ZenithLogo;
