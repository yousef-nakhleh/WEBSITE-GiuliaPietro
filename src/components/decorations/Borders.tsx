import React from "react";

const Borders: React.FC<{
  color?: string;
  size?: number;
  offset?: number;
  strokeWidth?: number;
  opacity?: number;
}> = ({
  color = "#3C2A21",
  size = 40,
  offset = 12,
  strokeWidth = 2,
  opacity = 0.8,
}) => {
  const Corner = () => (
    <path d="M1 10V1H10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" />
  );

  return (
    <>
      {/* top-right corner (outside) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        className="absolute"
        style={{
          top: -offset,
          right: -offset,
          opacity,
        }}
        fill="none"
      >
        <Corner />
      </svg>

      {/* bottom-left corner (outside) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        className="absolute"
        style={{
          bottom: -offset,
          left: -offset,
          opacity,
          transform: "rotate(180deg)",
        }}
        fill="none"
      >
        <Corner />
      </svg>
    </>
  );
};

export default Borders;