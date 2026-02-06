import React from "react";

type Props = { size?: number; strokeWidth?: number; color?: string; className?: string };

export default function BorderBottomLeft({
  size = 42,
  strokeWidth = 3,
  color = "#3C2A21",
  className,
}: Props) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="square"
    >
      {/* └  = vertical mirror of ┌ */}
      <g transform="scale(1,-1) translate(0,-100)">
        <path d="M0 100 L0 0 L100 0" />
      </g>
    </svg>
  );
}