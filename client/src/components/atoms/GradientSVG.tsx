import { nanoid } from 'nanoid';
import React from 'react';

interface GradientSVGProps {
  fillColor: string[] | string;
  children: React.ReactNode;
  gradientId?: string;
}

const GradientSVG: React.FC<GradientSVGProps> = ({
  fillColor,
  children,
  gradientId = nanoid(),
}) => {
  const fillColorArray = Array.isArray(fillColor) ? fillColor : [fillColor];

  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="100%"
      viewBox="0 0 992 928"
      enableBackground="new 0 0 992 928"
      xmlSpace="preserve"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {fillColorArray.map((color, index) => (
            <stop
              key={index}
              offset={fillColorArray.length > 1 ? `${(index / (fillColorArray.length - 1)) * 100}%` : '100%'}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
      {React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement, {
          fill: `url(#${gradientId})`,
        }),
      )}
    </svg>
  );
};

export default GradientSVG;
