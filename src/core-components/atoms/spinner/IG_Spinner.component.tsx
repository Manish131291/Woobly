import * as React from "react";

import "./IG_Spinner.style.scss";

interface IconProps {
  iconName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}
export const IG_Spinner = ({ iconName, size = "lg" }: IconProps) => {
  return (
    <div
      className={`spinner-container ${iconName ? "icon" : ""}`}
      data-testid="SPNR"
    >
      <div className={`loader loader--${size}`}></div>
      {""}
    </div>
  );
};
