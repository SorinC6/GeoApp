import React from "react";
import PlaceTwoTone from "@material-ui/icons/PlaceTwoTone";

export default ({ size, color, onClick }) => (
  <div>
    <PlaceTwoTone onClick={onClick} style={{ fontSize: size, color }} />
  </div>
);
